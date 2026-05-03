import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
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
        const email = session.customer_email || session.customer_details?.email || '';
        const name = session.metadata?.customerName || session.customer_details?.name || 'Client';
        const address = session.metadata?.customerAddress || '';
        const city = session.metadata?.customerCity || '';

        let client = await prisma.client.findUnique({ where: { email } });
        if (!client) {
          client = await prisma.client.create({
            data: {
              email,
              nom: name.split(' ')[0],
              prenom: name.split(' ').slice(1).join(' '),
              mot_de_passe_hash: 'guest_stripe',
              role: 'CLIENT'
            }
          });
        }

        await prisma.commande.create({
          data: {
            numero_commande: `STRIPE-${session.id.slice(-10)}`,
            client_id: client.id,
            adresse_livraison: `${address}, ${city}`,
            adresse_facturation: `${address}, ${city}`,
            statut: 'PAYEE',
            montant_total: (session.amount_total || 0),
          },
        });

        console.log(`✅ Commande créée via Stripe pour: ${email}`);
      } catch (dbError) {
        console.error('Failed to create order in DB:', dbError);
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
