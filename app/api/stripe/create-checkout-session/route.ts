import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail, customerName, customerAddress, customerCity } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    // Build Stripe line items from cart items
    const lineItems = items.map((item: {
      title: string;
      image: string;
      price: number;
      quantity: number;
    }) => ({
      price_data: {
        currency: 'xaf', // Franc CFA d'Afrique centrale
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price), // XAF has no decimal sub-units
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?cancelled=true`,
      metadata: {
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
