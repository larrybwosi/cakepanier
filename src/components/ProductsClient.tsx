"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { useDebounce } from "use-debounce";
import {
  Search,
  Loader2,
  Grid3x3,
  List,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { DealioProduct } from "@/lib/dealio/types";
import { loadMoreProducts } from "@/lib/dealio/list.actions";
import { ProductCard } from "@/components/ProductCard";

interface ProductsClientProps {
  initialProducts: DealioProduct[];
  categories: any[];
  pagination: {
    page: number;
    totalPages: number;
  };
}

export function ProductsClient({
  initialProducts,
  categories,
  pagination: initialPagination,
}: ProductsClientProps) {
  // 1. URL State
  const [pageUrl, setPageUrl] = useQueryState(
    "page",
    parseAsInteger
      .withDefault(1)
      .withOptions({ shallow: true, history: "replace" }),
  );
  const [categoryUrl, setCategoryUrl] = useQueryState(
    "category",
    parseAsString,
  );
  const [searchUrl, setSearchUrl] = useQueryState("search", parseAsString);

  // Internal search state for debouncing
  const [searchTerm, setSearchTerm] = useState(searchUrl || "");
  const [debouncedSearch] = useDebounce(searchTerm, 400);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 2. Data State
  const [products, setProducts] = useState<DealioProduct[]>(initialProducts);
  const [localPage, setLocalPage] = useState(initialPagination.page);
  const [hasMore, setHasMore] = useState(
    initialPagination.page < initialPagination.totalPages,
  );
  const [isPending, startTransition] = useTransition();

  // 3. Observer - Higher rootMargin (600px) triggers fetch much earlier
  const { ref, inView } = useInView({
    rootMargin: "600px",
    threshold: 0,
  });

  // 4. Sync URL with debounced search
  useEffect(() => {
    setSearchUrl(debouncedSearch || null);
    setPageUrl(1);
  }, [debouncedSearch, setSearchUrl, setPageUrl]);

  // 5. Reset list when server data changes (Initial Load/Filter Change)
  useEffect(() => {
    setProducts(initialProducts);
    setLocalPage(initialPagination.page);
    setHasMore(initialPagination.page < initialPagination.totalPages);
  }, [initialProducts, initialPagination]);

  // 6. Logic to fetch next page
  const loadMore = useCallback(async () => {
    // Prevent fetching if already loading, no more data, or if we are still on the first page load
    if (isPending || !hasMore) return;

    const nextPage = localPage + 1;

    startTransition(async () => {
      const response = await loadMoreProducts(nextPage, categoryUrl, searchUrl);

      if (response.success && response.data) {
        setProducts((prev) => [...prev, ...response.data.products]);
        setLocalPage(nextPage);
        setHasMore(nextPage < response.data.pagination.totalPages);
        setPageUrl(nextPage);
      }
    });
  }, [localPage, hasMore, isPending, categoryUrl, searchUrl, setPageUrl]);

  // Trigger loadMore when sentinel is in view
  useEffect(() => {
    if (inView && !isPending && hasMore) {
      loadMore();
    }
  }, [inView, loadMore, isPending, hasMore]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setSearchUrl(null);
    setCategoryUrl(null);
    setPageUrl(1);
  };

  const hasActiveFilters = searchUrl || categoryUrl;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background border-b border-border/40 mb-4 md:mb-6">
        <div className="container mx-auto px-3 sm:px-4 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                Products
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 md:mt-1">
                Showing {products.length} products
              </p>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                {searchUrl && (
                  <Badge
                    variant="secondary"
                    className="gap-1 px-2 py-0.5 text-xs"
                  >
                    Search: "{searchUrl}"
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSearchUrl(null);
                      }}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs h-6 px-1.5"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-start lg:items-center justify-between">
            <div className="relative w-full lg:max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border/60 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <select
                className="flex-1 lg:flex-none pl-3 pr-8 py-2 bg-muted/30 border border-border/60 rounded-lg text-sm cursor-pointer"
                value={categoryUrl || ""}
                onChange={(e) => {
                  setCategoryUrl(e.target.value || null);
                  setPageUrl(1);
                }}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center border border-border/60 rounded-lg overflow-hidden shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    viewMode === "grid" ? "bg-primary/10 text-primary" : ""
                  }
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    viewMode === "list" ? "bg-primary/10 text-primary" : ""
                  }
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4">
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
              : "flex flex-col gap-4"
          }
        >
          {products.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Sentinel & Loading UI */}
        <div ref={ref} className="w-full flex justify-center py-12">
          {isPending && hasMore && (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <span className="text-sm font-medium text-muted-foreground">
                Loading more...
              </span>
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <p className="text-sm text-muted-foreground italic">
              End of the catalog
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
