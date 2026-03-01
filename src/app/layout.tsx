import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { DealioCustomerSync } from "@/components/DealioCustomerSync";
import { NuqsAdapter } from "nuqs/adapters/next/app";

// Enterprise SEO: Base URL is required for absolute URL resolution in OG images/canonicals
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cakepanier.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Cake Panier | Premium Bakery & Cafe",
    template: "%s | Cake Panier Bakery",
  },
  description:
    "Premium bakery and cafe in Cheptulu, offering fresh cakes, pastries, beverages & snacks with delivery service. Specializing in event cakes, savory pies, and artisanal baked goods.",
  keywords: [
    "bakery Cheptulu",
    "cafe Kaimosi",
    "cake delivery Kenya",
    "Cake Panier",
    "event cakes",
    "custom cakes",
    "fresh pastries",
    "beef pie",
    "pizza",
    "fresh juice",
    "online bakery",
    "catering service",
  ],
  authors: [{ name: "Cake Panier Bakery", url: SITE_URL }],
  creator: "Cake Panier",
  publisher: "Cake Panier Bakery",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cake Panier - Premium Bakery & Delivery Service",
    description:
      "Fresh cakes, pastries, beverages & snacks delivered to your door. Specializing in event cakes, savory pies, and artisanal baked goods.",
    url: SITE_URL,
    siteName: "Cake Panier Bakery",
    type: "website",
    locale: "en_KE", // Upgraded to Kenyan locale
    images: [
      {
        url: "https://cdn.sanity.io/images/7rkl59hi/production/a5c0fa6115fafb5d79fb5f1b1bbe623d57d33d05-1905x991.png?auto=format&fmt=webp",
        width: 1200,
        height: 630,
        alt: "Cake Panier Bakery - Fresh Cakes and Pastries",
      },
      {
        url: "https://cdn.sanity.io/images/7rkl59hi/production/4c3e8f308baec02e30cab2a5a2ffd98235db4129-3024x4032.jpg?auto=format&fmt=webp",
        width: 1200,
        height: 630,
        alt: "Premium Cakes, Pastries and Baked Goods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cake Panier - Premium Bakery & Delivery",
    description:
      "Fresh cakes, pastries & snacks with delivery. Event cakes, beef pies, pizza & more!",
    creator: "@cakepanier",
    images: [
      "https://cdn.sanity.io/images/7rkl59hi/production/a5c0fa6115fafb5d79fb5f1b1bbe623d57d33d05-1905x991.png?auto=format&fmt=webp",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "food",
};

// Next.js 14+ best practice for viewport settings
export const viewport: Viewport = {
  themeColor: "#ffffff", // Update with your brand color
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Enterprise SEO: JSON-LD Structured Data for Local Businesses
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["Bakery", "CafeOrCoffeeShop"],
  name: "Cake Panier",
  image: [
    "https://cdn.sanity.io/images/7rkl59hi/production/a5c0fa6115fafb5d79fb5f1b1bbe623d57d33d05-1905x991.png?auto=format&fmt=webp",
    "https://cdn.sanity.io/images/7rkl59hi/production/4c3e8f308baec02e30cab2a5a2ffd98235db4129-3024x4032.jpg?auto=format&fmt=webp",
  ],
  "@id": `${SITE_URL}/#bakery`,
  url: SITE_URL,
  telephone: "+254 114020977",
  priceRange: "KSh",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cheptulu",
    addressLocality: "Kaimosi",
    addressRegion: "Vihiga", // Adjust county if needed
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 0.1345, // TODO: Update with actual coordinates for Kaimosi map pin
    longitude: 34.84,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
  ],
  servesCuisine: ["Bakery", "Pastries", "Coffee", "Fast Food"],
  acceptsReservations: "False",
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
      <body className="antialiased font-sans bg-gray-50">
        {/* Injecting JSON-LD Schema for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
        <DealioCustomerSync />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Footer />
      </body>
    </html>
  );
}
