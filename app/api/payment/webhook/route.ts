import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    // PayHere sends application/x-www-form-urlencoded data
    const formData = await request.formData()
    
    const merchantId = formData.get('merchant_id') as string
    const orderId = formData.get('order_id') as string
    const paymentId = formData.get('payment_id') as string
    const payhereAmount = formData.get('payhere_amount') as string
    const payhereCurrency = formData.get('payhere_currency') as string
    const statusCode = formData.get('status_code') as string
    const md5sig = formData.get('md5sig') as string

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || ''

    // Verify signature
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase()

    const localSigString = merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret
    const localSig = crypto
      .createHash('md5')
      .update(localSigString)
      .digest('hex')
      .toUpperCase()

    if (md5sig !== localSig) {
      console.warn('Invalid signature for PayHere callback:', { orderId, md5sig, localSig })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Initialize Supabase Admin client (using service role key or standard client if RLS policies permit update)
    // Here we can use service role client or standard client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase URL or keys are missing')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (statusCode === '2') {
      // Payment successful
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'processing', // move to processing status
        })
        .eq('id', orderId)

      console.log(`Payment successful for order ${orderId}, updated database status to paid.`)
    } else {
      // Payment failed or was cancelled/pending
      console.log(`Payment status for order ${orderId} is ${statusCode}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error in PayHere webhook:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
