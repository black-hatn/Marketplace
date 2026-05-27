import Stripe from 'stripe';

// Singleton Stripe server-side instance
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeKey, {
  // Cast nécessaire : le SDK npm ne définit pas encore tous les types
  // pour les versions preview de l'API Stripe.
  apiVersion: '2025-06-30.basil' as any,
  typescript: true,
});
