export type Product = {
  id: string;
  title: string;
  category: string;
  vendor: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string;
  tagline: string;
  image: string;
  href: string;
};

export type Brand = {
  slug: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  story: string;
  values: string;
  impact: string;
  image: string;
};

export type NavigationSection = {
  id: string;
  title: string;
  description: string;
  href: string;
  links: Array<{ label: string; href: string }>;
};

export const navigationSections: NavigationSection[] = [
  {
    id: 'mode',
    title: 'Mode',
    description: 'Collections premium, silhouettes sculpturales et mode responsable.',
    href: '/mode',
    links: [
      { label: 'Nouveautés', href: '/produits?category=Mode' },
      { label: 'Luxe durable', href: '/produits?category=Mode' },
      { label: 'Streetwear', href: '/produits?category=Mode' }
    ]
  },
  {
    id: 'tech',
    title: 'Tech',
    description: 'Gadgets connectés et expériences audio haute-fidélité.',
    href: '/tech',
    links: [
      { label: 'Audio immersif', href: '/produits?category=Tech' },
      { label: 'Smart home', href: '/produits?category=Tech' },
      { label: 'Mobilité', href: '/produits?category=Tech' }
    ]
  },
  {
    id: 'maison',
    title: 'Maison',
    description: 'Design d’intérieur, ambiance intelligente et lifestyle premium.',
    href: '/maison',
    links: [
      { label: 'Décoration', href: '/produits?category=Maison' },
      { label: 'Mobilier', href: '/produits?category=Maison' },
      { label: 'Bien-être', href: '/produits?category=Maison' }
    ]
  },
  {
    id: 'sante',
    title: 'Santé',
    description: 'Solutions de bien-être connectées et soins experts.',
    href: '/sante',
    links: [
      { label: 'Nutrition', href: '/produits?category=Santé' },
      { label: 'Soins', href: '/produits?category=Santé' },
      { label: 'Routines', href: '/produits?category=Santé' }
    ]
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Accompagnement premium pour installations et coaching.',
    href: '/services',
    links: [
      { label: 'Consulting', href: '/produits' },
      { label: 'Installation', href: '/produits' },
      { label: 'Support pro', href: '/produits' }
    ]
  }
];

export const bentoItems = [
  {
    title: 'Vendeurs Vérifiés',
    tag: 'Confiance Premium',
    description: 'Achetez en toute sérénité auprès d\'entreprises certifiées et notées par la communauté.',
    image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&w=800&q=80',
    accent: 'from-emerald-500/10 to-transparent'
  },
  {
    title: 'Contact Direct',
    tag: 'Rapide & Simple',
    description: 'Échangez instantanément via WhatsApp ou téléphone pour conclure vos affaires.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    accent: 'from-blue-500/10 to-transparent'
  },
  {
    title: 'Localisation Précise',
    tag: 'Près de chez vous',
    description: 'Trouvez les meilleures offres disponibles directement dans votre ville au Tchad.',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    accent: 'from-orange-500/10 to-transparent'
  },
  {
    title: 'Devenir Vendeur',
    tag: 'Opportunité Pro',
    description: 'Créez votre boutique en 2 minutes et commencez à vendre vos produits dès aujourd\'hui.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    accent: 'from-cyan-500/10 to-transparent'
  }
];

export const heroSuggestions = [
  { label: 'Sneakers urbains', category: 'Mode', image: 'https://images.unsplash.com/photo-1519741494470-0717a6f0f05f?auto=format&fit=crop&w=700&q=80' },
  { label: 'Casque audio spatial', category: 'Tech', image: 'https://images.unsplash.com/photo-1516375195444-1d9d0d0b52e7?auto=format&fit=crop&w=700&q=80' },
  { label: 'Lampe sculpturale', category: 'Maison', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=700&q=80' },
  { label: 'Routine zen', category: 'Santé', image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=700&q=80' }
];

export const featuredProducts: Product[] = [
  {
    id: 'p1',
    title: 'Sneakers Aero Luxe',
    category: 'Mode',
    vendor: 'Studio Éclat',
    price: 189,
    rating: 4.9,
    reviews: 128,
    badge: 'Édition limitée',
    tagline: 'Confort premium avec inspiration futuriste.',
    image: 'https://images.unsplash.com/photo-1519741494470-0717a6f0f05f?auto=format&fit=crop&w=900&q=80',
    href: '/produit/p1'
  },
  {
    id: 'p2',
    title: 'Casque Orbital 7D',
    category: 'Tech',
    vendor: 'Pulse Audio',
    price: 349,
    rating: 4.8,
    reviews: 92,
    badge: 'Best-seller',
    tagline: 'Immersion sonore à haute résolution.',
    image: 'https://images.unsplash.com/photo-1516375195444-1d9d0d0b52e7?auto=format&fit=crop&w=900&q=80',
    href: '/produit/p2'
  },
  {
    id: 'p3',
    title: 'Lampe Atelier Sculpt',
    category: 'Maison',
    vendor: 'Lumi Studio',
    price: 129,
    rating: 4.7,
    reviews: 64,
    badge: 'Design exclusif',
    tagline: 'Éclairage sculptural pour intérieur contemporain.',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    href: '/produit/p3'
  },
  {
    id: 'p4',
    title: 'Box Bien-être Vital',
    category: 'Santé',
    vendor: 'ZenLabs',
    price: 99,
    rating: 4.9,
    reviews: 54,
    badge: 'Pack action',
    tagline: 'Rituels santé validés par experts.',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
    href: '/produit/p4'
  }
];

export const allProducts: Product[] = featuredProducts;

export const brands: Brand[] = [
  {
    slug: 'studio-eclat',
    name: 'Studio Éclat',
    title: 'L’élégance sculpturale par Studio Éclat',
    tagline: 'Silhouettes techniques, confort responsable.',
    description: 'Studio Éclat conçoit des éditions limitées pensés pour les citadins qui recherchent un équilibre entre modernité et durabilité.',
    story: 'Chaque paire est produite dans des ateliers sélectionnés, avec un accent sur la qualité des matières et l’impact environnemental réduit.',
    values: 'Conception éthique, matériaux recyclés et esthétique premium dans chaque détail.',
    impact: 'Studio Éclat incarne une mode performante qui aime autant la ville que la planète.',
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    slug: 'pulse-audio',
    name: 'Pulse Audio',
    title: 'Immersion sonore par Pulse Audio',
    tagline: 'Audio haute-fidélité, design sensoriel.',
    description: 'Pulse Audio redéfinit l’écoute avec des casques et des enceintes pensés pour les expériences immersives et le confort longue durée.',
    story: 'La marque associe expertise acoustique et finitions premium pour des produits qui résonnent autant visuellement que techniquement.',
    values: 'Performance audio, innovation connectée et expérience tactile maîtrisée.',
    impact: 'Pulse Audio transforme chaque moment d’écoute en une signature émotionnelle unique.',
    image: 'https://images.unsplash.com/photo-1516701696756-5e5a9f5d7f1d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    slug: 'lumi-studio',
    name: 'Lumi Studio',
    title: 'Lumi Studio, lumière sculptée',
    tagline: 'Ambiance architecturale et design chaleureux.',
    description: 'Lumi Studio crée des luminaires inspirés par l’art et la matière, pour transformer les espaces de vie en lieux à la fois simples et graphiques.',
    story: 'Chaque création met la lumière au cœur du design, avec une attention particulière portée aux textures, aux formes et aux scénarios d’utilisation.',
    values: 'Intimité, raffinement et direction créative assumée.',
    impact: 'Lumi Studio propose une atmosphère premium, élégante et durable pour la maison contemporaine.',
    image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80'
  },
  {
    slug: 'zenlabs',
    name: 'ZenLabs',
    title: 'ZenLabs, bien-être intelligent',
    tagline: 'Rituels premium pour énergie et sérénité.',
    description: 'ZenLabs développe des offres bien-être hybrides, entre science de l’équilibre et expérience produit sensorielle.',
    story: 'La marque se concentre sur des gammes validées par des experts, avec des formats pratiques et des ingrédients choisis pour leur efficacité.',
    values: 'Simplicité sophistiquée, support client réactif et résultats mesurables.',
    impact: 'ZenLabs crée des routines accessibles, efficaces et pensées pour la vie moderne.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80'
  }
];

export const brandStories = [
  {
    title: 'Éco-conception et transparence',
    copy: 'Chaque partenaire est sélectionné pour ses process durables et son engagement social.',
    highlight: 'Durabilité mesurée, production maîtrisée.'
  },
  {
    title: 'Innovation sensorielle',
    copy: 'Des expériences produits pensées pour la durée, avec un design tactile et une intention narrative.',
    highlight: 'Technologie immersive, boucle courte.'
  },
  {
    title: 'Support premium',
    copy: 'Un accompagnement dédié, des retours simplifiés et un service client expert.',
    highlight: 'Assistance multi-vendeur en temps réel.'
  }
];

export const categoryFilters = [
  {
    id: 'mode',
    label: 'Mode',
    filters: ['Taille', 'Couleur', 'Coupe', 'Éco-fibre']
  },
  {
    id: 'tech',
    label: 'Tech',
    filters: ['Voltage', 'Autonomie', 'Compatibilité', 'Connectivité']
  },
  {
    id: 'maison',
    label: 'Maison',
    filters: ['Matériau', 'Style', 'Surface', 'Ambiance']
  },
  {
    id: 'sante',
    label: 'Santé',
    filters: ['Type de soin', 'Certification', 'Formulation', 'Marque']
  }
];
