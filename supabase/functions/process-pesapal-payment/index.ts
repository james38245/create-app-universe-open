
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
    
    const pesapalConsumerKey = Deno.env.get('PESAPAL_CONSUMER_KEY')
    const pesapalConsumerSecret = Deno.env.get('PESAPAL_CONSUMER_SECRET')
    
    if (!pesapalConsumerKey || !pesapalConsumerSecret) {
      throw new Error('Pesapal credentials not configured')
    }

    console.log('Processing M-Pesa payment via Pesapal:', { amount, phoneNumber, bookingId, txRef })

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Pesapal access token
    const tokenResponse = await fetch('https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        consumer_key: pesapalConsumerKey,
        consumer_secret: pesapalConsumerSecret
      })
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenData.token) {
      throw new Error('Failed to get Pesapal access token')
    }

    // Prepare M-Pesa payment payload for Pesapal
    const paymentPayload = {
      id: txRef,
      currency: "KES",
      amount: amount,
      description: `Payment for booking ${bookingId}`,
      callback_url: "https://yourapp.com/payment/callback",
      notification_id: txRef,
      billing_address: {
        email_address: customerEmail,
        phone_number: phoneNumber,
        country_code: "KE",
        first_name: customerName.split(' ')[0] || customerName,
        last_name: customerName.split(' ')[1] || '',
        line_1: "Nairobi",
        line_2: "",
        city: "Nairobi",
        state: "Nairobi",
        postal_code: "00100",
        zip_code: "00100"
      }
    }

    // Submit order to Pesapal
    const orderResponse = await fetch('https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(paymentPayload)
    })

    const orderResult = await orderResponse.json()
    console.log('Pesapal order response:', orderResult)

    if (orderResult.status === '200' && orderResult.order_tracking_id) {
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
          status: 'pending',
          mpesa_transaction_id: orderResult.order_tracking_id
        })

      if (transactionError) {
        console.error('Error creating transaction record:', transactionError)
      }

      // Update booking with payment information
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'pending',
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
          message: 'Payment initiated successfully',
          data: {
            order_tracking_id: orderResult.order_tracking_id,
            merchant_reference: orderResult.merchant_reference,
            redirect_url: orderResult.redirect_url
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    } else {
      throw new Error(orderResult.description || 'Payment initiation failed')
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
