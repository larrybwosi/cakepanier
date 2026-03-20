import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { ProductReviews } from '@/components/ProductReviews';
import { getCatalogProduct } from '@/lib/dealio/catalog';
import { DealioNotFoundError } from '@/lib/dealio/errors';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

// ─── Helper: Fetch Inventory for all variants ────────────────────────────────

async function getProductInventory(variants: any[]) {
  if (!variants || variants.length === 0) return {};

  const inventoryMap: Record<string, { isAvailable: boolean; isLowStock: boolean; totalStock?: number }> = {};
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // Adjust if needed

  await Promise.all(
    variants.map(async variant => {
      try {
        const res = await fetch(`${baseUrl}/api/dealio/inventory/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variantId: variant.id }),
          // Cache the result for 5 minutes (300 seconds)
          next: { revalidate: 300 },
        });

        if (res.ok) {
          const data = await res.json();
          inventoryMap[variant.id] = data.data;
        } else {
          inventoryMap[variant.id] = { isAvailable: false, isLowStock: false };
        }
      } catch (error) {
        console.error(`Failed to fetch inventory for variant ${variant.id}`, error);
        inventoryMap[variant.id] = { isAvailable: false, isLowStock: false };
      }
    })
  );

  return inventoryMap;
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getCatalogProduct(id);
    const primaryImage = product.images?.[0] || '/placeholder.svg';

    return {
      title: `${product?.name}`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        type: 'website',
        images: [{ url: primaryImage }],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description,
        images: [primaryImage],
      },
      alternates: {
        canonical: `/products/${id}`,
      },
    };
  } catch {
    return { title: 'Product | Cakepanier' };
  }
}

// ─── Page Component ──────────────────────────────────────────────────────────

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  let product;
  let inventoryMap = {};

  try {
    product = await getCatalogProduct(id);
    // Pre-fetch inventory for all variants on the server
    inventoryMap = await getProductInventory(product.variants || []);
  } catch (err) {
    if (err instanceof DealioNotFoundError) {
      notFound();
    }
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center py-24">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">Unable to load product</h1>
            <p className="text-muted-foreground">Please try again in a moment.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductDetailClient product={product} inventoryMap={inventoryMap} />
      <div className="container mx-auto px-4 pb-12">
        <ProductReviews productId={product.id} productName={product?.name} />
      </div>
    </div>
  );
};

export default Page;
