import { createClient } from '@/lib/supabase/server'
import { getStripe, getCasePrice } from '@/lib/stripe'
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
    console.log('DEBUG: Starting Stripe checkout...')
    console.log('DEBUG: STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
    console.log('DEBUG: Key prefix:', process.env.STRIPE_SECRET_KEY?.substring(0, 12))

    // Get Stripe instance
    const stripe = getStripe()
    console.log('DEBUG: Stripe instance created')

    const origin = request.headers.get('origin') || 'https://specter-game.vercel.app'
    console.log('DEBUG: Origin:', origin)

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
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&case=${caseSlug}`,
      cancel_url: `${origin}/checkout/cancel?case=${caseSlug}`,
      metadata: {
        user_id: user.id,
        case_id: caseData.id,
        case_slug: caseSlug,
      },
      customer_email: user.email,
    })

    console.log('DEBUG: Session created:', session.id)
    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    console.error('Error type:', error?.type)
    console.error('Error code:', error?.code)
    console.error('Error message:', error?.message)
    console.error('Raw error:', error?.raw)
    return NextResponse.json({
      error: 'Failed to create checkout session',
      details: error?.message || 'Unknown error',
      type: error?.type || 'unknown',
      code: error?.code || 'unknown'
    }, { status: 500 })
  }
}
