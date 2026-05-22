import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';
// prisma imported above — used for Paiement upsert (#16)

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET env variable is not set.");
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      try {
        const orderId = session.metadata?.orderId;
        if (orderId) {
          const { processOrderPayment } = await import('@/lib/actions');
          await processOrderPayment(orderId);

          // #16 — Stocker le payment_intent pour les remboursements éventuels
          const paymentIntentId = typeof session.payment_intent === 'string'
            ? session.payment_intent
            : null;
          if (paymentIntentId) {
            await prisma.paiement.upsert({
              where: { transaction_id_stripe: paymentIntentId },
              create: {
                commande_id: orderId,
                montant: session.amount_total ?? 0,
                methode: 'STRIPE',
                statut: 'REUSSI',
                transaction_id_stripe: paymentIntentId,
                date_paiement: new Date(),
              },
              update: {},
            });
          }

          console.log(`✅ Commande payée via Stripe (ID: ${orderId})`);
        } else {
          console.warn(`⚠️ Webhook: session.metadata.orderId manquante`);
        }
      } catch (dbError) {
        console.error('Failed to process payment in Webhook:', dbError);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.warn(`❌ Payment failed for intent: ${intent.id}`);
      break;
    }

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
