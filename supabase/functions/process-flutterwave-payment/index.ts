
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, phoneNumber, bookingId, customerEmail, customerName, txRef } = await req.json()
    
    const flutterwaveSecretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY')
    if (!flutterwaveSecretKey) {
      throw new Error('Flutterwave secret key not configured')
    }

    console.log('Processing M-Pesa payment:', { amount, phoneNumber, bookingId, txRef })

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Prepare M-Pesa payment payload for Flutterwave
    const paymentPayload = {
      tx_ref: txRef,
      amount: amount,
      currency: "KES",
      country: "KE",
      payment_options: "mobilemoneykenya",
      customer: {
        email: customerEmail,
        name: customerName,
        phonenumber: phoneNumber
      },
      customizations: {
        title: "Venue/Service Booking Payment",
        description: `Payment for booking ${bookingId}`,
        logo: "https://yourapp.com/logo.png"
      },
      redirect_url: "https://yourapp.com/payment/callback",
      meta: {
        booking_id: bookingId
      }
    }

    // Make payment request to Flutterwave
    const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${flutterwaveSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentPayload)
    })

    const paymentResult = await flutterwaveResponse.json()
    console.log('Flutterwave response:', paymentResult)

    if (paymentResult.status === 'success') {
      // Calculate payment breakdown
      const commissionAmount = amount * 0.10 // 10% commission
      const transactionFee = amount * 0.03 // 3% transaction fee
      const sellerAmount = amount - commissionAmount - transactionFee

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          booking_id: bookingId,
          transaction_type: 'payment',
          amount: amount,
          status: 'processed',
          mpesa_transaction_id: paymentResult.data.flw_ref
        })

      if (transactionError) {
        console.error('Error creating transaction record:', transactionError)
      }

      // Update booking with payment information
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          payment_method: 'mpesa',
          commission_amount: commissionAmount,
          transaction_fee: transactionFee,
          seller_amount: sellerAmount,
          refund_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        })
        .eq('id', bookingId)

      if (bookingError) {
        console.error('Error updating booking:', bookingError)
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment processed successfully',
          data: paymentResult.data
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      throw new Error(paymentResult.message || 'Payment failed')
    }

  } catch (error) {
    console.error('Payment processing error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || 'Payment processing failed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
