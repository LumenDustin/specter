import { createClient } from '@/lib/supabase/server'
import { stripe, getCasePrice } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { caseSlug } = body

  if (!caseSlug) {
    return NextResponse.json({ error: 'Case slug required' }, { status: 400 })
  }

  // Get case details
  const { data: caseData, error: caseError } = await supabase
    .from('cases')
    .select('id, slug, title, is_free')
    .eq('slug', caseSlug)
    .eq('is_published', true)
    .single()

  if (caseError || !caseData) {
    return NextResponse.json({ error: 'Case not found' }, { status: 404 })
  }

  // Check if case is free
  if (caseData.is_free) {
    return NextResponse.json({ error: 'This case is free' }, { status: 400 })
  }

  // Check if already purchased
  const { data: existingPurchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('case_id', caseData.id)
    .single()

  if (existingPurchase) {
    return NextResponse.json({ error: 'Already purchased' }, { status: 400 })
  }

  // Get price
  const priceInCents = getCasePrice(caseSlug)
  if (!priceInCents) {
    return NextResponse.json({ error: 'Price not configured' }, { status: 400 })
  }

  try {
    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `SPECTER Case: ${caseData.title}`,
              description: `Access to Case File #${caseSlug.toUpperCase()}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}&case=${caseSlug}`,
      cancel_url: `${request.headers.get('origin')}/checkout/cancel?case=${caseSlug}`,
      metadata: {
        user_id: user.id,
        case_id: caseData.id,
        case_slug: caseSlug,
      },
      customer_email: user.email,
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error?.message || error)
    return NextResponse.json({
      error: 'Failed to create checkout session',
      details: error?.message || 'Unknown error'
    }, { status: 500 })
  }
}
