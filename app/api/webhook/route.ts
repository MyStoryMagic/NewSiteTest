import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover'
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

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
      event = JSON.parse(body)
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Stripe webhook event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const tier = session.metadata?.tier

        if (userId && tier) {
          // Update subscription in database
          await supabase
            .from('subscriptions')
            .update({
              tier: tier,
              stripe_subscription_id: session.subscription as string,
              stripe_customer_id: session.customer as string,
              stories_used_this_month: 0,
              voice_stories_used_this_month: 0,
              cycle_reset_date: new Date().toISOString()
            })
            .eq('user_id', userId)

          console.log(`✅ Upgraded user ${userId} to ${tier}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user by customer ID
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (sub) {
          // Check if subscription is active
          const isActive = subscription.status === 'active' || subscription.status === 'trialing'
          
          if (!isActive) {
            // Downgrade to free
            await supabase
              .from('subscriptions')
              .update({ tier: 'free' })
              .eq('user_id', sub.user_id)

            console.log(`⬇️ Downgraded user ${sub.user_id} to free`)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Find user and downgrade to free
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (sub) {
          await supabase
            .from('subscriptions')
            .update({ 
              tier: 'free',
              stripe_subscription_id: null
            })
            .eq('user_id', sub.user_id)

          console.log(`❌ Cancelled subscription for user ${sub.user_id}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        console.log(`⚠️ Payment failed for customer ${customerId}`)
        // Could send email notification here
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
