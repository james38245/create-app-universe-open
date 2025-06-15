
-- Add refund-related columns to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS refund_amount numeric,
ADD COLUMN IF NOT EXISTS refund_requested_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS refund_approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS refund_processed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS refund_reason text,
ADD COLUMN IF NOT EXISTS cancelled_by uuid,
ADD COLUMN IF NOT EXISTS cancellation_reason text;

-- Update transactions table to support refund transactions
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS refund_amount numeric,
ADD COLUMN IF NOT EXISTS original_transaction_id uuid REFERENCES public.transactions(id);

-- Create function to calculate refund amount (total - transaction fees only, no commission deducted)
CREATE OR REPLACE FUNCTION public.calculate_refund_amount(
  booking_amount numeric,
  transaction_fee_rate numeric DEFAULT 3
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  result jsonb;
  transaction_fee numeric;
  refund_amount numeric;
BEGIN
  -- Calculate transaction fee (percentage of total amount)
  transaction_fee := booking_amount * (transaction_fee_rate / 100);
  
  -- Calculate refund amount (total - transaction fee, no commission deducted for refunds)
  refund_amount := booking_amount - transaction_fee;
  
  result := jsonb_build_object(
    'original_amount', booking_amount,
    'transaction_fee', transaction_fee,
    'refund_amount', refund_amount,
    'fee_retained', transaction_fee
  );
  
  RETURN result;
END;
$$;

-- Create function to process refund
CREATE OR REPLACE FUNCTION public.process_refund(
  booking_uuid uuid,
  refund_reason text DEFAULT NULL,
  cancelled_by_user_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  booking_record public.bookings%ROWTYPE;
  refund_calculation jsonb;
  refund_amount numeric;
BEGIN
  -- Get booking details
  SELECT * INTO booking_record FROM public.bookings WHERE id = booking_uuid;
  
  -- Check if booking exists and payment was made
  IF booking_record.id IS NULL OR booking_record.payment_status != 'paid' THEN
    RETURN false;
  END IF;
  
  -- Calculate refund amount
  refund_calculation := calculate_refund_amount(booking_record.total_amount);
  refund_amount := (refund_calculation->>'refund_amount')::numeric;
  
  -- Update booking with refund information
  UPDATE public.bookings 
  SET 
    status = 'cancelled',
    payment_status = 'refunded',
    refund_amount = refund_amount,
    refund_requested_at = CASE WHEN refund_requested_at IS NULL THEN now() ELSE refund_requested_at END,
    refund_approved_at = now(),
    refund_processed_at = now(),
    refund_reason = COALESCE(refund_reason, 'Booking cancelled'),
    cancelled_by = cancelled_by_user_id,
    payout_status = 'cancelled'
  WHERE id = booking_uuid;
  
  -- Create refund transaction record
  INSERT INTO public.transactions (
    booking_id, 
    transaction_type, 
    amount,
    refund_amount,
    status
  )
  VALUES (
    booking_uuid, 
    'refund', 
    booking_record.total_amount,
    refund_amount,
    'processed'
  );
  
  RETURN true;
END;
$$;

-- Create policies for refund transactions
CREATE POLICY "Users can view refund transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (
    transaction_type = 'refund' AND
    EXISTS (
      SELECT 1 FROM public.bookings b 
      WHERE b.id = booking_id 
      AND (b.client_id = auth.uid() OR 
           EXISTS (SELECT 1 FROM public.venues v WHERE v.id = b.venue_id AND v.owner_id = auth.uid()) OR
           EXISTS (SELECT 1 FROM public.service_providers sp WHERE sp.id = b.service_provider_id AND sp.user_id = auth.uid()))
    )
  );
