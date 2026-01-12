import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { subscription: 'PREMIUM' },
          })

          await prisma.payment.create({
            data: {
              userId,
              stripeId: session.id,
              amount: (session.amount_total || 0) / 100,
              currency: session.currency || 'usd',
              status: session.payment_status || 'paid',
              subscriptionTier: 'PREMIUM',
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        // Find user by subscription and downgrade
        const payment = await prisma.payment.findFirst({
          where: { stripeId: subscription.id },
        })

        if (payment) {
          await prisma.user.update({
            where: { id: payment.userId },
            data: { subscription: 'FREE' },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
