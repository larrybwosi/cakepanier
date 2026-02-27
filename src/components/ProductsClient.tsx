'use client';

import { useState, useMemo } from 'react';
import { Star, Search, Filter, Heart, ShoppingCart, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import type { DealioProduct, DealioCategory } from '@/lib/dealio/types';

interface Props {
  products: DealioProduct[];
  categories: DealioCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function ProductsClient({ products, categories, pagination }: Props) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);

  const sortOptions = [
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price-low', label: 'Price (Low to High)' },
    { value: 'price-high', label: 'Price (High to Low)' },
  ];

  const toggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId],
    );
  };

  const getLowestPrice = (product: DealioProduct): number => {
    if (!product.variants?.length) return 0;
    return Math.min(...product.variants.map(v => v.price));
  };

  const getPrimaryImage = (product: DealioProduct): string => {
    const primary = product.images?.find(img => img.isPrimary);
    return primary?.url ?? product.images?.[0]?.url ?? '/placeholder.svg?height=300&width=400';
  };

  const isInStock = (product: DealioProduct): boolean =>
    product.variants?.some(v => v.isAvailable) ?? false;

  const filteredAndSorted = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === 'all' || p.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return getLowestPrice(a) - getLowestPrice(b);
        case 'price-high':
          return getLowestPrice(b) - getLowestPrice(a);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, sortBy]);

  return (
    <>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(o => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredAndSorted.length} of {pagination.total} products
        </div>
      </div>

      {/* Product Grid / List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {filteredAndSorted.map(product => {
          const inStock = isInStock(product);
          const lowestPrice = getLowestPrice(product);
          const image = getPrimaryImage(product);
          const hasMultipleVariants = product.variants?.length > 1;

          return (
            <Card
              key={product.id}
              className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${
                !inStock ? 'opacity-60' : ''
              } ${viewMode === 'list' ? 'flex flex-row' : ''}`}
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <CardContent className={`p-0 ${viewMode === 'list' ? 'flex w-full' : ''}`}>
                {/* Image */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === 'list'
                      ? 'w-48 h-32 shrink-0 rounded-l-lg'
                      : 'w-full h-48 rounded-t-lg'
                  }`}
                >
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 z-10 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </div>
                  )}
                  {!inStock && (
                    <div className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
                      Out of Stock
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10 p-1 h-8 w-8 bg-background/80 hover:bg-background"
                    onClick={e => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(product.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className={`p-4 space-y-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-display font-semibold text-foreground line-clamp-1">
                      {product.name}
                    </h3>
                    <span className="text-lg font-bold text-primary shrink-0 ml-2">
                      {hasMultipleVariants ? 'From ' : ''}Ksh {lowestPrice.toLocaleString()}
                    </span>
                  </div>

                  <p
                    className={`text-muted-foreground leading-relaxed ${
                      viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3'
                    }`}
                  >
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 text-secondary fill-secondary"
                        />
                      ))}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {product.category?.name ?? 'Uncategorized'}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled={!inStock}
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/products/${product.id}`);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      disabled={!inStock}
                      onClick={e => {
                        e.stopPropagation();
                        router.push(`/products/${product.id}`);
                      }}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredAndSorted.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
}
