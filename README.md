# Marketplace Immersive

Plateforme e-commerce multi-secteurs construite avec Next.js 14, Tailwind CSS, Framer Motion, Zustand et une architecture headless.

## Points clés

- `app/page.tsx` : page d'accueil structurée pour une expérience immersive.
- `components/` : composants modulaires pour Mega Menu, recherche prédictive, Bento Grid, filtres, panier et confiance.
- `lib/store.ts` : panier multi-vendeurs avec persistance locale via `zustand`.
- `app/globals.css` : design glassmorphism, dark/light adaptatif et animations de skeleton.

## Installation

```bash
npm install
npm run dev
```

## Notes

- `components/ThreePlaceholder.tsx` contient un placeholder 3D optionnel basé sur `three`.
- La navigation et les composants respectent l’accessibilité (A11y) via des labels, états focus et rôles ARIA.
