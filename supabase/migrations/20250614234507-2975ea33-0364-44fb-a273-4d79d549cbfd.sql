
-- Add payment account information to profiles
ALTER TABLE public.profiles ADD COLUMN payment_account_type text;
ALTER TABLE public.profiles ADD COLUMN payment_account_number text;
ALTER TABLE public.profiles ADD COLUMN payment_account_name text;

-- Add financial tracking columns to bookings
ALTER TABLE public.bookings ADD COLUMN commission_percentage numeric DEFAULT 10;
ALTER TABLE public.bookings ADD COLUMN commission_amount numeric;
ALTER TABLE public.bookings ADD COLUMN seller_amount numeric;
ALTER TABLE public.bookings ADD COLUMN transaction_fee numeric;
ALTER TABLE public.bookings ADD COLUMN refund_deadline timestamp with time zone;
ALTER TABLE public.bookings ADD COLUMN payout_status text DEFAULT 'pending';
ALTER TABLE public.bookings ADD COLUMN payout_date timestamp with time zone;

-- Create transactions table for detailed financial tracking
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid REFERENCES public.bookings(id) NOT NULL,
  transaction_type text NOT NULL, -- 'payment', 'commission', 'payout', 'refund'
  amount numeric NOT NULL,
  status text DEFAULT 'pending',
  mpesa_transaction_id text,
  created_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for transactions (users can see their own transactions)
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = booking_id 
      AND (b.client_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM public.venues v WHERE v.id = b.venue_id AND v.owner_id = auth.uid()) OR
           EXISTS (SELECT 1 FROM public.service_providers sp WHERE sp.id = b.service_provider_id AND sp.user_id = auth.uid()))
    )
  );

-- Create function to calculate payment breakdown
CREATE OR REPLACE FUNCTION public.calculate_payment_breakdown(
  booking_amount numeric,
  commission_rate numeric DEFAULT 10,
  transaction_fee_rate numeric DEFAULT 3
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  commission_amount numeric;
  transaction_fee numeric;
  seller_amount numeric;
BEGIN
  -- Calculate commission (percentage of total amount)
  commission_amount := booking_amount * (commission_rate / 100);
  
  -- Calculate transaction fee (percentage of total amount)
  transaction_fee := booking_amount * (transaction_fee_rate / 100);
  
  -- Calculate seller amount (total - commission - transaction fee)
  seller_amount := booking_amount - commission_amount - transaction_fee;
  
  result := jsonb_build_object(
    'total_amount', booking_amount,
    'commission_percentage', commission_rate,
    'commission_amount', commission_amount,
    'transaction_fee_percentage', transaction_fee_rate,
    'transaction_fee', transaction_fee,
    'seller_amount', seller_amount,
    'app_retains', commission_amount + transaction_fee
  );
  
  RETURN result;
END;
$$;

-- Create function to process automatic payouts
CREATE OR REPLACE FUNCTION public.process_automatic_payout(booking_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  booking_record public.bookings%ROWTYPE;
  payout_amount numeric;
BEGIN
  -- Get booking details
  SELECT * INTO booking_record FROM public.bookings WHERE id = booking_uuid;
  
  -- Check if refund period has passed and payment is confirmed
  IF booking_record.refund_deadline < now() AND booking_record.payment_status = 'paid' THEN
    -- Update payout status
    UPDATE public.bookings 
    SET payout_status = 'processed',
        payout_date = now()
    WHERE id = booking_uuid;
    
    -- Create payout transaction record
    INSERT INTO public.transactions (booking_id, transaction_type, amount, status)
    VALUES (booking_uuid, 'payout', booking_record.seller_amount, 'processed');
    
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;
