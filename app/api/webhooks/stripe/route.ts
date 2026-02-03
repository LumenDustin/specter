import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendEmail, EmailTemplates } from '@/lib/email'

// Use service role for webhook (no user context)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature if secret is configured
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } else {
      // For testing without webhook secret
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const caseId = session.metadata?.case_id
    const caseSlug = session.metadata?.case_slug

    if (!userId || !caseId) {
      console.error('Missing metadata in session:', session.id)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // Record the purchase
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        user_id: userId,
        case_id: caseId,
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent as string,
        amount: session.amount_total,
        currency: session.currency,
        status: 'completed',
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
