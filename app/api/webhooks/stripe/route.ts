import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendEmail, EmailTemplates } from '@/lib/email'
import crypto from 'crypto'

// Use service role for webhook (no user context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verify Stripe webhook signature manually (no SDK needed)
function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const elements = signature.split(',')
  const timestamp = elements.find(e => e.startsWith('t='))?.split('=')[1]
  const v1Signature = elements.find(e => e.startsWith('v1='))?.split('=')[1]

  if (!timestamp || !v1Signature) {
    return false
  }

  // Check timestamp is within tolerance (5 minutes)
  const tolerance = 300 // 5 minutes
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(timestamp)) > tolerance) {
    console.error('Webhook timestamp too old')
    return false
  }

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex')

  // Compare signatures
  return crypto.timingSafeEqual(
    Buffer.from(v1Signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  // Verify webhook signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (webhookSecret) {
    const isValid = verifyStripeSignature(body, signature, webhookSecret)
    if (!isValid) {
      console.error('Webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
  }

  // Parse the event
  let event: any
  try {
    event = JSON.parse(body)
  } catch (error) {
    console.error('Failed to parse webhook body:', error)
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('Webhook received:', event.type)

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const userId = session.metadata?.user_id
    const caseId = session.metadata?.case_id
    const caseSlug = session.metadata?.case_slug

    if (!userId || !caseId) {
      console.error('Missing metadata in session:', session.id)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    console.log(`Processing purchase: User ${userId}, Case ${caseId}`)

    // Record the purchase (using correct column names from schema)
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        case_id: caseId,
        stripe_payment_id: session.payment_intent || session.id,
        amount_cents: session.amount_total,
        purchased_at: new Date().toISOString(),
      })

    if (purchaseError) {
      console.error('Failed to record purchase:', purchaseError)
      // Don't return error - payment succeeded, we can reconcile later
    } else {
      console.log(`Purchase recorded: User ${userId} bought case ${caseSlug}`)

      // Send confirmation email
      if (session.customer_email && caseSlug) {
        // Fetch case title
        const { data: caseData } = await supabase
          .from('cases')
          .select('title')
          .eq('id', caseId)
          .single()

        if (caseData) {
          const emailTemplate = EmailTemplates.purchaseConfirmation(caseData.title, caseSlug)
          await sendEmail({
            to: session.customer_email,
            ...emailTemplate,
          })
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
