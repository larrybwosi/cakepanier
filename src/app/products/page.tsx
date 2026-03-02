import type { Metadata } from "next";
import Header from "@/components/Header";
import { ProductsClient } from "@/components/ProductsClient";
import { getCatalogProducts, getCatalogCategories } from "@/lib/dealio/catalog";

interface SearchParams {
  page?: string;
  category?: string;
  search?: string;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;

  const title = params.search
    ? `Search: "${params.search}" | Our Products`
    : params.category
      ? `Browse by Category | Our Products`
      : "Our Products | Artisan Breads, Pastries & Desserts";

  const description =
    "Discover our complete collection of artisan breads, pastries, and desserts, all made fresh daily with the finest ingredients.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/pastries-display.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/pastries-display.jpg"],
    },
    alternates: {
      canonical: "/products",
    },
  };
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
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
    console.error("[products page] Dealio fetch failed:", err);
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 text-center py-24">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
              Unable to load products
            </h1>
            <p className="text-muted-foreground">
              Our catalog is temporarily unavailable. Please try again in a
              moment.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const pageTitle = params.search
    ? `Results for "${params.search}"`
    : params.category
      ? `Browse Products`
      : "Our Products";

  const currentPage = params.page ? Number(params.page) : 1;
  const totalPages = productsRes.pagination?.totalPages ?? 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Pagination link hints for crawlers */}
          {currentPage > 1 && (
            <link
              rel="prev"
              href={`/products?page=${currentPage - 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${params.search}` : ""}`}
            />
          )}
          {currentPage < totalPages && (
            <link
              rel="next"
              href={`/products?page=${currentPage + 1}${params.category ? `&category=${params.category}` : ""}${params.search ? `&search=${params.search}` : ""}`}
            />
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              {params.search || params.category ? (
                pageTitle
              ) : (
                <>
                  Our <span className="text-primary">Products</span>
                </>
              )}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our complete collection of artisan breads, pastries, and
              desserts, all made fresh daily with the finest ingredients.
            </p>
          </div>

          <ProductsClient
            initialProducts={productsRes.products}
            categories={categories}
            pagination={productsRes.pagination}
          />
        </div>
      </main>
    </div>
  );
};

export default Page;
