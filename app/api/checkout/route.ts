import { createClient } from '@/lib/supabase/server'
import { getCasePrice } from '@/lib/stripe'
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
    const origin = request.headers.get('origin') || 'https://specter-game.vercel.app'
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    // Use direct fetch instead of SDK to bypass potential SDK issues
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'payment_method_types[0]': 'card',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': `SPECTER Case: ${caseData.title}`,
        'line_items[0][price_data][product_data][description]': `Access to Case File #${caseSlug.toUpperCase()}`,
        'line_items[0][price_data][unit_amount]': priceInCents.toString(),
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&case=${caseSlug}`,
        'cancel_url': `${origin}/checkout/cancel?case=${caseSlug}`,
        'metadata[user_id]': user.id,
        'metadata[case_id]': caseData.id,
        'metadata[case_slug]': caseSlug,
        'customer_email': user.email || '',
      }),
    })

    const session = await response.json()

    if (!response.ok) {
      console.error('Stripe API error:', session)
      return NextResponse.json({
        error: 'Stripe API error',
        details: session.error?.message || 'Unknown error',
        type: session.error?.type || 'unknown',
      }, { status: 500 })
    }

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({
      error: 'Failed to create checkout session',
      details: error?.message || 'Unknown error',
    }, { status: 500 })
  }
}
