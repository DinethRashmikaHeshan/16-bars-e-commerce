import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { orderId, amount } = await request.json()

    if (!orderId || !amount) {
      return NextResponse.json({ error: 'orderId and amount are required' }, { status: 400 })
    }

    const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID || 'your_payhere_merchant_id_here'
    // For sandbox/testing, if they haven't configured a secret, we can use a mock/empty string or standard sandbox secret
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || ''

    const currency = 'LKR'
    // Format amount to 2 decimal places (without thousands separator)
    const amountFormatted = parseFloat(amount)
      .toLocaleString('en-US', { minimumFractionDigits: 2, useGrouping: false })

    // Hash algorithm: uppercase(md5(merchant_id + order_id + amount_formatted + currency + uppercase(md5(merchant_secret))))
    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase()

    const hashString = merchantId + orderId + amountFormatted + currency + hashedSecret
    const hash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase()

    return NextResponse.json({ hash, amountFormatted })
  } catch (err) {
    console.error('Error generating PayHere hash:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
