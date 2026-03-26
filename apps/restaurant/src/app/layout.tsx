import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { BrandProvider } from "@repo/ui/lib/brand-context";
import { ChefHat } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Elegant Dining | Modern Restaurant",
  description: "A premium dining experience with seasonal ingredients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-body antialiased`}>
        <NuqsAdapter>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <BrandProvider config={{
              name: "Elegant Dining",
              logo: <ChefHat className="h-8 w-8 text-primary" />,
              phone: "+254 123 456 789",
              heroTitleLine1: "Exquisite Flavors",
              heroTitleLine2: "Unforgettable Evenings",
              heroDescription: "Indulge in a culinary journey where every dish is a masterpiece, crafted with seasonal ingredients and modern techniques.",
              aboutTitleLine1: "The Art of Dining",
              aboutTitleLine2: "Since 2010",
              aboutDescription1: "Our restaurant is dedicated to providing an exceptional dining experience that combines innovative cuisine with warm, attentive service.",
              aboutDescription2: "We source our ingredients from local farmers and artisans to ensure the highest quality and support our community.",
              founderName: "Chef Alessandro Rossi",
              founderTitle: "Executive Chef & Founder"
            }}>
              {children}
            </BrandProvider>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
