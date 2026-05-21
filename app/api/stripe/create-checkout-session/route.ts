import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail, customerName, customerAddress, customerCity } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    // 1. Create or find Client in database
    let client = await prisma.client.findUnique({ where: { email: customerEmail } });
    if (!client) {
      client = await prisma.client.create({
        data: {
          email: customerEmail,
          nom: customerName.split(' ')[0] || customerName,
          prenom: customerName.split(' ').slice(1).join(' ') || '',
          mot_de_passe_hash: 'guest_stripe',
          role: 'CLIENT'
        }
      });
    }

    const subtotal = items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= 100000 ? 0 : 2500;
    const finalTotal = subtotal + shipping;

    // 2. Pre-create the order as EN_ATTENTE
    const order = await prisma.commande.create({
      data: {
        numero_commande: `STRIPE-${Date.now()}`,
        client_id: client.id,
        adresse_livraison: `${customerAddress}, ${customerCity}`,
        adresse_facturation: `${customerAddress}, ${customerCity}`,
        statut: 'EN_ATTENTE',
        montant_total: finalTotal,
        lignes_commande: {
          create: items.map((item: any) => ({
            produit_id: item.id, // product ID
            quantite: item.quantity,
            prix_unitaire_ht: item.price,
            tva_appliquee: 18
          }))
        }
      }
    });

    // Build Stripe line items from cart items
    const lineItems = items.map((item: {
      title: string;
      image: string;
      price: number;
      quantity: number;
    }) => ({
      price_data: {
        currency: 'xaf', // Franc CFA
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price), // XAF has no decimal sub-units
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if not free
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'xaf',
          product_data: {
            name: 'Frais de livraison',
          },
          unit_amount: shipping,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=true`,
      metadata: {
        orderId: order.id,
        customerName,
        customerAddress,
        customerCity,
      },
      shipping_address_collection: {
        allowed_countries: ['TD', 'CM', 'SN', 'CI', 'BJ', 'FR'],
      },
      phone_number_collection: {
        enabled: true,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
