import Stripe from 'stripe';

// Singleton Stripe server-side instance
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-04-22.dahlia' as any,
  typescript: true,
});
