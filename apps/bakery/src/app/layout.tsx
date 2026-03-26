import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { BrandProvider } from "@repo/ui/lib/brand-context";
import { Wheat } from "lucide-react";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cakepanier.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Cake Panier | Premium Bakery & Cafe Cheptulu',
    template: '%s | Cake Panier Bakery',
  },
  description:
    'Premium bakery and cafe in Cheptulu. Fresh cakes, pastries, savory pies, and artisanal breads delivered to your door. Best cafe in Kaimosi area.',
  keywords: [
    'bakery Cheptulu',
    'cafe Kaimosi',
    'cake delivery Kenya',
    'Cake Panier',
    'event cakes',
    'custom cakes',
    'fresh pastries',
    'beef pie',
    'pizza',
    'fresh juice',
    'online bakery',
    'catering service',
  ],
  authors: [{ name: 'Cake Panier Bakery', url: SITE_URL }],
  creator: 'Cake Panier',
  publisher: 'Cake Panier Bakery',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Cake Panier - Premium Bakery & Delivery Service',
    description:
      'Fresh cakes, pastries, beverages & snacks delivered to your door. Specializing in event cakes, savory pies, and artisanal baked goods.',
    url: SITE_URL,
    siteName: 'Cake Panier Bakery',
    type: 'website',
    locale: 'en_KE',
    images: [
      {
        url: '/hero-bakery.jpg',
        width: 1200,
        height: 630,
        alt: 'Cake Panier Bakery - Fresh Cakes and Pastries',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cake Panier - Premium Bakery & Delivery',
    description: 'Fresh cakes, pastries & snacks with delivery. Event cakes, beef pies, pizza & more!',
    creator: '@cakepanier',
    images: ['/hero-bakery.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'food',
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': ['Bakery', 'CafeOrCoffeeShop'],
  name: 'Cake Panier',
  image: [
    'https://cdn.sanity.io/images/7rkl59hi/production/a5c0fa6115fafb5d79fb5f1b1bbe623d57d33d05-1905x991.png?auto=format&fmt=webp',
    'https://cdn.sanity.io/images/7rkl59hi/production/4c3e8f308baec02e30cab2a5a2ffd98235db4129-3024x4032.jpg?auto=format&fmt=webp',
  ],
  '@id': `${SITE_URL}/#bakery`,
  url: SITE_URL,
  telephone: '+254 114020977',
  priceRange: 'KSh',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Cheptulu',
    addressLocality: 'Kaimosi',
    addressRegion: 'Vihiga',
    addressCountry: 'KE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 0.1345,
    longitude: 34.84,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '20:00',
    },
  ],
  servesCuisine: ['Bakery', 'Pastries', 'Coffee', 'Fast Food'],
  acceptsReservations: 'False',
  menu: `${SITE_URL}/products`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-L0MS04RB1W" />
      <body className={`${inter.variable} ${playfair.variable} antialiased font-body bg-gray-50`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <NuqsAdapter>
          <BrandProvider config={{
            name: "Cake Panier",
            logo: <Wheat className="h-8 w-8 text-primary" />,
            phone: "+254 114020977",
            heroTitleLine1: "Fresh Baked",
            heroTitleLine2: "Every Morning",
            heroDescription: "Experience the finest artisanal breads, pastries, and desserts crafted with love using traditional methods and the freshest ingredients.",
            aboutTitleLine1: "Crafting Memories",
            aboutTitleLine2: "Since 1999",
            aboutDescription1: "At The Cake Panier, we believe that great baking starts with passion, quality ingredients, and time-honored traditions.",
            aboutDescription2: "From our signature sourdough made with a century-old starter to our delicate French pastries, every item in our bakery tells a story of craftsmanship.",
            founderName: "Marie & Jean-Pierre Dubois",
            founderTitle: "Master Bakers & Founders"
          }}>
            {children}
          </BrandProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
