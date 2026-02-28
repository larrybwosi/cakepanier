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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getCatalogProduct(id);
    return {
      title: `${product?.name}`,
      description: product.description,
    };
  } catch {
    return { title: 'Product | Cakepanier' };
  }
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  let product;
  try {
    product = await getCatalogProduct(id);
    // console.log('Fetched product:', product);
  } catch (err) {
    if (err instanceof DealioNotFoundError) {
      notFound();
    }
    // On other errors show a graceful message
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center py-24">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Unable to load product
            </h1>
            <p className="text-muted-foreground">Please try again in a moment.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProductDetailClient product={product} />
      {/* Reviews are still Supabase-backed — product_id stores the Dealio product ID */}
      <div className="container mx-auto px-4 pb-12">
        <ProductReviews productId={product.id} productName={product?.name}/>
      </div>
    </div>
  );
};

export default Page;
