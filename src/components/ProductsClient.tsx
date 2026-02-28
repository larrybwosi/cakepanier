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
  X,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  // Helper to clear all filters
  const clearAllFilters = () => {
    setSearchUrl(null);
    setCategoryUrl(null);
    setPageUrl(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchUrl || categoryUrl;

  return (
    <div className="min-h-screen bg-background">
      {/* Header & Filters - Now static, not sticky */}
      <div className="bg-background border-b border-border/40 mb-4 md:mb-6">
        <div className="container mx-auto px-3 sm:px-4 py-4 md:py-6">
          {/* Title and results count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                Products
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 md:mt-1">
                Showing {products.length} products
                {categoryUrl && ` in selected category`}
                {searchUrl && ` matching "${searchUrl}"`}
              </p>
            </div>

            {/* Active filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Active filters:
                </span>
                {searchUrl && (
                  <Badge
                    variant="secondary"
                    className="gap-1 px-2 md:px-3 py-0.5 md:py-1 text-xs"
                  >
                    Search: "{searchUrl}"
                    <button
                      onClick={() => setSearchUrl(null)}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    </button>
                  </Badge>
                )}
                {categoryUrl && (
                  <Badge
                    variant="secondary"
                    className="gap-1 px-2 md:px-3 py-0.5 md:py-1 text-xs"
                  >
                    Category:{" "}
                    {categories.find((c) => c.id === categoryUrl)?.name ||
                      categoryUrl}
                    <button
                      onClick={() => setCategoryUrl(null)}
                      className="ml-1 hover:text-foreground"
                    >
                      <X className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    </button>
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs h-6 md:h-7 px-1.5 md:px-2"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          {/* Filter controls - Enhanced design */}
          <div className="flex flex-col lg:flex-row gap-3 md:gap-4 items-start lg:items-center justify-between">
            {/* Search input */}
            <div className="relative w-full lg:max-w-md group">
              <div className="absolute inset-y-0 left-0 pl-2.5 md:pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 bg-muted/30 border border-border/60 rounded-lg md:rounded-xl text-xs md:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                value={searchUrl || ""}
                onChange={(e) => {
                  setSearchUrl(e.target.value || null);
                  setPageUrl(1);
                }}
              />
            </div>

            <div className="flex items-center gap-2 md:gap-3 w-full lg:w-auto">
              {/* Category select */}
              <div className="relative flex-1 lg:flex-none group min-w-[160px] md:min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-2.5 md:pl-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <SlidersHorizontal className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </div>
                <select
                  className="w-full pl-8 md:pl-10 pr-8 md:pr-10 py-2 md:py-3 bg-muted/30 border border-border/60 rounded-lg md:rounded-xl text-xs md:text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 cursor-pointer"
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
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 md:px-3 pointer-events-none text-muted-foreground">
                  <ChevronDown className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </div>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center border border-border/60 rounded-lg md:rounded-xl overflow-hidden shrink-0 bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-none px-2.5 md:px-4 h-8 md:h-10 ${
                    viewMode === "grid"
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-none px-2.5 md:px-4 h-8 md:h-10 ${
                    viewMode === "list"
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Container - Reduced padding on mobile for wider cards */}
      <div className="container mx-auto px-2 sm:px-3 md:px-4">
        {/* Product Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8"
              : "flex flex-col gap-2 sm:gap-3 md:gap-4"
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
          <div ref={ref} className="w-full flex justify-center py-8 md:py-16">
            {isPending ? (
              <div className="flex flex-col items-center gap-2 md:gap-3">
                <div className="relative">
                  <Loader2 className="h-6 w-6 md:h-8 md:w-8 text-primary animate-spin" />
                  <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full" />
                </div>
                <span className="text-xs md:text-sm font-medium text-muted-foreground animate-pulse">
                  Loading more products...
                </span>
              </div>
            ) : (
              <div className="h-6 w-6 md:h-8 md:w-8" /> // Invisible spacer
            )}
          </div>
        )}

        {/* End of Catalog State */}
        {!hasMore && products.length > 0 && (
          <div className="flex flex-col items-center justify-center py-8 md:py-16 opacity-60">
            <Separator className="w-16 md:w-24 mb-4 md:mb-6" />
            <p className="text-xs md:text-sm text-muted-foreground font-medium tracking-wide">
              You&apos;ve reached the end of the catalog. {products.length}{" "}
              products total.
            </p>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && !isPending && (
          <div className="flex flex-col items-center justify-center py-16 md:py-32 px-3 md:px-4 text-center">
            <div className="relative">
              <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-muted/30 flex items-center justify-center mb-4 md:mb-6 border border-border/50 shadow-inner">
                <PackageSearch className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
              </div>
              <div className="absolute inset-0 blur-2xl bg-muted/20 rounded-full" />
            </div>
            <h3 className="text-lg md:text-2xl font-semibold text-foreground mb-2 md:mb-3">
              No products found
            </h3>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mb-6 md:mb-8 text-balance">
              We couldn&apos;t find anything matching your current filters. Try
              adjusting your search terms or category selection.
            </p>
            <Button
              onClick={clearAllFilters}
              className="gap-2 px-4 md:px-6 text-sm md:text-base"
              size="default"
            >
              <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
