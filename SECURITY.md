# 🔒 Politique de Sécurité — Immersive Marketplace

## Mesures de Sécurité Implémentées

### Authentification & Autorisation
- **JWT via NextAuth.js** : Sessions signées côté serveur avec `NEXTAUTH_SECRET`
- **Mots de passe hashés** : bcrypt avec coût 10 (`bcryptjs`) — aucun mot de passe en clair en base
- **RBAC (Role-Based Access Control)** : 3 rôles (`ADMIN`, `VENDOR`, `CLIENT`) vérifiés à chaque server action
- **Guards de layout** : `/admin` et `/vendeur` redirigent vers `/admin/login` si non authentifié (jamais de passthrough silencieux)
- **Ownership checks** : `updateProfile`, `markAsRead`, `requestWithdrawal` vérifient que l'utilisateur ne peut modifier que ses propres ressources

### Protection CSRF
- **Protection native Next.js 14** : Les Server Actions incluent automatiquement des tokens CSRF dans les headers `Origin` / `Content-Type`
- Aucune route API critique n'accepte des requêtes cross-origin non autorisées

### Rate Limiting
- **Connexion** : 10 tentatives max par compte sur 15 minutes (`lib/rateLimit.ts`)
- **Avis produits** : 3 avis max par heure par utilisateur (identifié par ID session ou IP réelle via `x-forwarded-for`)
- La clé de rate-limit pour les anonymes inclut l'IP pour éviter le blocage global

### Validation des Données
- **Zod** : Validation typée côté serveur sur toutes les créations/modifications de produits
- **Sanitisation des inputs** : Trim, longueur minimale, types vérifiés avant toute écriture en base
- **Intégrité du stock** : `createOrder` s'exécute dans une `prisma.$transaction` pour éliminer les race conditions

### Secrets & Environnement
- `.env` et `.env.*` exclus du dépôt Git via `.gitignore`
- Mot de passe admin stocké sous forme de hash bcrypt dans la variable d'environnement
- Aucune clé API exposée côté client (toutes dans des Server Actions ou API Routes)

### Base de Données
- **Prisma ORM** : Requêtes paramétrées, aucune concaténation SQL (pas d'injection SQL possible)
- **RLS Supabase** : Row Level Security activable au niveau PostgreSQL
- **Transactions atomiques** : Les opérations critiques (commande, retrait) utilisent `$transaction`

### Autres
- `userScalable` retiré du viewport (accessibilité)
- Headers de sécurité configurables via `next.config.mjs`
- Uploads d'images via Cloudinary (pas de fichiers locaux sur le serveur)

## Signalement de Vulnérabilités

Si vous découvrez une faille de sécurité, contactez :
**nouradinezakariamahamat2@gmail.com**

Ne publiez pas les vulnérabilités publiquement avant qu'elles soient corrigées.
