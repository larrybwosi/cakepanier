import Header from '@/components/Header';
import { ProductsClient } from '@/components/ProductsClient';
import { getCatalogProducts, getCatalogCategories } from '@/lib/dealio/catalog';

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
}

export const dynamic = 'force-dynamic';

const Page = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;

  let productsRes;
  let categories;

  try {
    [productsRes, categories] = await Promise.all([
      getCatalogProducts({
        page: params.page ? Number(params.page) : 1,
        limit: 20,
        categoryId: params.category ?? undefined,
        search: params.search ?? undefined,
      }),
      getCatalogCategories(),
    ]);
  } catch (err) {
    console.error('[products page] Dealio fetch failed:', err);
    // Render a graceful error state without crashing
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center py-24">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Unable to load products
            </h1>
            <p className="text-muted-foreground">
              Our catalog is temporarily unavailable. Please try again in a moment.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our <span className="text-primary">Products</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of artisan breads, pastries, and desserts,
              all made fresh daily with the finest ingredients.
            </p>
          </div>

          <ProductsClient
            products={productsRes.data}
            categories={categories}
            pagination={productsRes.pagination}
          />
        </div>
      </main>
    </div>
  );
};

export default Page;
