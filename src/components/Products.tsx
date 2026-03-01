import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getFeaturedCatalogProducts } from "@/lib/dealio/catalog";
import { DealioProduct } from "@/lib/dealio/types";
import sanityLoader from "@/lib/sanity-loader";

const Products = async () => {
  let products = [] as DealioProduct[];

  // 1. Fetch the featured products in a single API call
  try {
    const response = await getFeaturedCatalogProducts({
      isFeatured: true,
      limit: 4, // Limiting to 4 to match your 4-column grid layout
    });

    // console.log("Featured products response:", JSON.stringify(response.products, null, 2));
    products = response.products || [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    // You could also return a graceful error state here if desired
  }

  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Our Signature
            <span className="block text-primary">Products</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully crafted selection of breads, pastries, and
            desserts, made fresh daily using traditional techniques and premium
            ingredients.
          </p>
        </div>

        {/* Page Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.length > 0 ? (
            products.map((product) => {
              // Map API data to UI
              const imageUrl = product.images?.[0] || "/placeholder.jpg";

              // Assuming price lives on the variant. Adjust if your type uses a different structure.
              const price = product.variants?.[0]?.price
                ? `Ksh ${product.variants[0].price}`
                : "Price unavailable";

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-soft hover-lift border border-border/50 group-hover:border-primary/30 transition-all duration-300">
                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      {product.isFeatured && (
                        <div className="absolute top-3 left-3 z-10 bg-linear-to-r from-secondary to-hero text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                          ⭐ Popular
                        </div>
                      )}
                      <div className="aspect-4/3 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.name}
                          width={400}
                          height={300}
                          loader={sanityLoader}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Product Info */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <span className="text-lg font-bold text-primary whitespace-nowrap">
                          {price}
                        </span>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-3.5 w-3.5 text-secondary fill-secondary"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground ml-1">
                            5.0
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant="outline"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 border-primary/20 hover:bg-primary hover:text-primary-foreground text-xs px-3"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            // 2. Added a fallback state in case no products are returned
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Check back soon for our featured products!
            </div>
          )}
        </div>

        {/* View All Page CTA */}
        <div className="text-center">
          <Link href="/products">
            <Button variant="hero" size="lg" className="px-8">
              View Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
