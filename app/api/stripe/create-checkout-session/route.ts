import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  // B — Protection CSRF
  const origin = req.headers.get('origin');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (origin && appUrl && origin !== appUrl) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { items, customerEmail, customerName, customerAddress, customerCity } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    // #8 + N — Vérification stock ET revalidation prix depuis la DB en une passe
    const verifiedItems: { id: string; title: string; image: string; price: number; quantity: number }[] = [];
    for (const item of items) {
      const product = await prisma.produit.findUnique({
        where: { id: item.id },
        select: { nom: true, prix_ttc: true, images: true, stock: true },
      });
      if (!product) {
        return NextResponse.json({ error: `Produit introuvable : ${item.title}` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour « ${product.nom} » (disponible : ${product.stock})` },
          { status: 400 }
        );
      }
      verifiedItems.push({
        id: item.id,
        title: product.nom,
        image: product.images[0] || item.image || '',
        price: Number(product.prix_ttc), // N — Prix autoritaire DB
        quantity: item.quantity,
      });
    }

    // 1. Trouver ou créer le client
    let client = await prisma.client.findUnique({ where: { email: customerEmail } });
    if (!client) {
      // #9 — Hash invité impossible à deviner (pas de login possible)
      const guestHash = await bcrypt.hash(`guest:${uuidv4()}`, 10);
      client = await prisma.client.create({
        data: {
          email: customerEmail,
          nom: customerName.split(' ')[0] || customerName,
          prenom: customerName.split(' ').slice(1).join(' ') || '',
          mot_de_passe_hash: guestHash,
          role: 'CLIENT',
        },
      });
    }

    // 2. Calcul avec les prix vérifiés
    const subtotal = verifiedItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= 100000 ? 0 : 2500;
    const finalTotal = subtotal + shipping;

    // 3. Pré-créer la commande EN_ATTENTE
    const order = await prisma.commande.create({
      data: {
        numero_commande: `STRIPE-${Date.now()}`,
        client_id: client.id,
        adresse_livraison: `${customerAddress}, ${customerCity}`,
        adresse_facturation: `${customerAddress}, ${customerCity}`,
        statut: 'EN_ATTENTE',
        montant_total: finalTotal,
        lignes_commande: {
          create: verifiedItems.map((item) => ({
            produit_id: item.id,
            quantite: item.quantity,
            prix_unitaire_ht: item.price,
            tva_appliquee: 18,
          })),
        },
      },
    });

    // 4. Construire les line items Stripe avec les prix DB
    const lineItems = verifiedItems.map((item) => ({
      price_data: {
        currency: 'xaf',
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price),
      },
      quantity: item.quantity,
    }));

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'xaf',
          product_data: { name: 'Frais de livraison', images: [] },
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
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?cancelled=true`,
      metadata: { orderId: order.id, customerName, customerAddress, customerCity },
      shipping_address_collection: { allowed_countries: ['TD', 'CM', 'SN', 'CI', 'BJ', 'FR'] },
      phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
