"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import {
  Search,
  SlidersHorizontal,
  PackageSearch,
  Loader2,
  Grid3x3,
  List,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  // 1. nuqs setup: Sync filters and page state to the URL
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // 2. Internal State for the infinite list
  const [products, setProducts] = useState<DealioProduct[]>(initialProducts);
  const [localPage, setLocalPage] = useState(initialPagination.page);
  const [hasMore, setHasMore] = useState(
    initialPagination.page < initialPagination.totalPages,
  );
  const [isPending, startTransition] = useTransition();

  // 3. Intersection Observer
  const { ref, inView } = useInView({
    rootMargin: "400px",
  });

  // 4. Reset state if the server passes new initial products
  useEffect(() => {
    setProducts(initialProducts);
    setLocalPage(initialPagination.page);
    setHasMore(initialPagination.page < initialPagination.totalPages);
  }, [initialProducts, initialPagination]);

  // 5. Load more logic
  const loadMore = useCallback(async () => {
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

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header & Filters */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-xl border-b border-border/40 mb-8 px-4 py-4 shadow-sm">
        <div className="container mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/60 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
              value={searchUrl || ""}
              onChange={(e) => {
                setSearchUrl(e.target.value || null);
                setPageUrl(1);
              }}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <select
                className="w-full sm:w-48 pl-10 pr-8 py-2.5 bg-muted/50 border border-border/60 rounded-lg text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 cursor-pointer"
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
              {/* Custom dropdown arrow to match select styling */}
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-muted-foreground">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center border border-border/60 rounded-lg overflow-hidden shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none px-3 h-9 ${
                  viewMode === "grid" ? "bg-muted/50" : ""
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`rounded-none px-3 h-9 ${
                  viewMode === "list" ? "bg-muted/50" : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Product Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
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

        {/* Loading Sentinel */}
        {hasMore && (
          <div ref={ref} className="w-full flex justify-center py-16">
            {isPending ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-sm font-medium text-muted-foreground animate-pulse">
                  Loading more products...
                </span>
              </div>
            ) : (
              <div className="h-8 w-8 border-4 border-transparent rounded-full" /> // Invisible spacer to maintain height before load triggers
            )}
          </div>
        )}

        {/* End of Catalog State */}
        {!hasMore && products.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16 opacity-60">
            <Separator className="w-24 mb-6" />
            <p className="text-muted-foreground text-sm font-medium tracking-wide">
              You&apos;ve reached the end of the catalog.
            </p>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && !isPending && (
          <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mb-6 border border-border/50 shadow-inner">
              <PackageSearch className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground max-w-md mb-8">
              We couldn't find anything matching your current filters or search
              terms. Try adjusting them to see more results.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchUrl(null);
                setCategoryUrl(null);
              }}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
