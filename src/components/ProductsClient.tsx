'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { useInView } from 'react-intersection-observer';
import { useQueryState, parseAsInteger, parseAsString } from 'nuqs';
import { useDebounce } from 'use-debounce';
import { Search, Loader2, Grid3x3, List, X, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import type { DealioProduct } from '@/lib/dealio/types';
import { loadMoreProducts } from '@/lib/dealio/list.actions';
import { ProductCard } from '@/components/ProductCard';

interface ProductsClientProps {
  initialProducts: DealioProduct[];
  categories: any[];
  pagination: {
    page: number;
    totalPages: number;
  };
}

export function ProductsClient({ initialProducts, categories, pagination: initialPagination }: ProductsClientProps) {
  // 1. URL State
  const [pageUrl, setPageUrl] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ shallow: true, history: 'replace' })
  );

  const [categoryUrl, setCategoryUrl] = useQueryState('category', parseAsString.withOptions({ shallow: false }));
  const [searchUrl, setSearchUrl] = useQueryState('search', parseAsString.withOptions({ shallow: false }));

  // Internal search state for debouncing
  const [searchTerm, setSearchTerm] = useState(searchUrl || '');
  const [debouncedSearch] = useDebounce(searchTerm, 400);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 2. Data & Transition State
  const [products, setProducts] = useState<DealioProduct[]>(initialProducts);
  const [localPage, setLocalPage] = useState(initialPagination.page);
  const [hasMore, setHasMore] = useState(initialPagination.page < initialPagination.totalPages);

  const [isPending, startTransition] = useTransition();
  const [isFiltering, startFiltering] = useTransition();

  // Combined Loading State for the Search Bar
  const isSearchLoading = searchTerm !== debouncedSearch || isFiltering;

  // 3. Observer
  const { ref, inView } = useInView({
    rootMargin: '600px',
    threshold: 0,
  });

  // 4. Sync URL with debounced search
  useEffect(() => {
    const currentSearch = searchUrl || '';
    const newSearch = debouncedSearch || '';

    if (currentSearch !== newSearch) {
      startFiltering(() => {
        setSearchUrl(debouncedSearch || null);
        setPageUrl(1);
      });
    }
  }, [debouncedSearch, searchUrl, setSearchUrl, setPageUrl]);

  // 5. Reset list when server data changes
  useEffect(() => {
    setProducts(initialProducts);
    setLocalPage(initialPagination.page);
    setHasMore(initialPagination.page < initialPagination.totalPages);
  }, [initialProducts, initialPagination]);

  // 6. Logic to fetch next page (Client-side)
  const loadMore = useCallback(async () => {
    if (isPending || !hasMore) return;

    const nextPage = localPage + 1;

    startTransition(async () => {
      const response = await loadMoreProducts(nextPage, categoryUrl, searchUrl);

      if (response.success && response.data) {
        setProducts(prev => [...prev, ...response.data.products]);
        setLocalPage(nextPage);
        setHasMore(nextPage < response.data.pagination.totalPages);
        setPageUrl(nextPage);
      }
    });
  }, [localPage, hasMore, isPending, categoryUrl, searchUrl, setPageUrl]);

  useEffect(() => {
    if (inView && !isPending && hasMore) {
      loadMore();
    }
  }, [inView, loadMore, isPending, hasMore]);

  const clearAllFilters = () => {
    setSearchTerm('');
    startFiltering(() => {
      setSearchUrl(null);
      setCategoryUrl(null);
      setPageUrl(1);
    });
  };

  const hasActiveFilters = searchUrl || categoryUrl;

  return (
    <div className="min-h-screen bg-background">
      {/* Header & Filter Section */}
      <div className="bg-card border-b border-border/50 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Title Area */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">Our Collection</h1>
              <p className="text-sm text-muted-foreground font-medium">Showing {products.length} artisanal products</p>
            </div>

            {/* Controls Area */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  {isSearchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Search pastries..."
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/60 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Select */}
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Filter className="h-4 w-4" />
                </div>
                <select
                  className="w-full pl-10 pr-8 py-2.5 bg-background border border-border/60 rounded-md text-sm cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  value={categoryUrl || ''}
                  onChange={e => {
                    startFiltering(() => {
                      setCategoryUrl(e.target.value || null);
                      setPageUrl(1);
                    });
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Toggles */}
              <div className="hidden sm:flex items-center border border-border/60 rounded-md overflow-hidden bg-background h-[42px]">
                <button
                  className={`px-3 h-full transition-colors flex items-center justify-center ${
                    viewMode === 'grid' ? 'bg-primary/5 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <div className="w-px h-full bg-border/60"></div>
                <button
                  className={`px-3 h-full transition-colors flex items-center justify-center ${
                    viewMode === 'list' ? 'bg-primary/5 text-primary' : 'text-muted-foreground hover:bg-muted'
                  }`}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Row */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/30">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Active Filters:
              </span>
              {searchUrl && (
                <Badge
                  variant="secondary"
                  className="px-2.5 py-1 rounded-md text-xs font-normal bg-primary/5 border-primary/10 text-foreground"
                >
                  Search: "{searchUrl}"
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      startFiltering(() => {
                        setSearchUrl(null);
                        setPageUrl(1);
                      });
                    }}
                    className="ml-2 hover:text-destructive focus:outline-none"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:text-primary/80 font-medium ml-2 underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Products Display */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8'
              : 'flex flex-col gap-6 max-w-4xl mx-auto'
          }
        >
          {products.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} viewMode={viewMode} />
          ))}
        </div>

        {/* Infinite Scroll Loader */}
        <div ref={ref} className="w-full flex justify-center py-16">
          {isPending && hasMore && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                Loading more...
              </span>
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <div className="flex items-center gap-4 w-full max-w-md mx-auto">
              <div className="flex-1 h-px bg-border/50"></div>
              <p className="text-sm text-muted-foreground font-serif italic">End of Collection</p>
              <div className="flex-1 h-px bg-border/50"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
