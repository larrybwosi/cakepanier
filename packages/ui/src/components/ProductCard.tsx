import { Star, Heart, ShoppingBag, AlertCircle, Eye, Tag } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import { useRouter } from 'next/navigation';
import type { DealioProduct } from '@repo/lib/dealio/types';
import { cn } from '@repo/ui/lib/utils';
import Image from 'next/image';
import sanityLoader from '@repo/lib/sanity-loader';

interface ProductCardProps {
  product: DealioProduct;
  viewMode?: 'grid' | 'list';
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  onClick?: () => void;
}

export function ProductCard({
  product,
  viewMode = 'grid',
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: ProductCardProps) {
  const router = useRouter();

  const getLowestPrice = (product: DealioProduct): number => {
    if (!product.variants?.length) return 0;
    return Math.min(...product.variants.map(v => v.price));
  };

  const getPrimaryImage = (product: DealioProduct): string => {
    return product.images?.[0] ?? '/placeholder.svg?height=300&width=400';
  };

  const getStockInfo = (product: DealioProduct) => {
    const totalStock = product.variants?.reduce((acc, v) => acc + (v.totalStock || 0), 0) ?? 0;
    const threshold = product.lowStockThreshold ?? 5;
    return {
      totalStock,
      isOutOfStock: totalStock <= 0,
      isLowStock: totalStock > 0 && totalStock <= threshold,
    };
  };

  const { totalStock, isOutOfStock, isLowStock } = getStockInfo(product);
  const lowestPrice = getLowestPrice(product);
  const image = getPrimaryImage(product);
  const hasMultipleVariants = product.variants?.length > 1;

  const handleCardClick = () => {
    if (onClick) onClick();
    else router.push(`/products/${product.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  if (viewMode === 'list') {
    return (
      <Card
        className={cn(
          'group cursor-pointer border-border/40 hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden bg-card rounded-md',
          isOutOfStock && 'opacity-75'
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-0 flex flex-col sm:flex-row w-full sm:h-48">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden bg-muted/20">
            <Image
              src={image}
              alt={product.name}
              fill
              className={cn(
                'object-cover transition-transform duration-700 ease-out group-hover:scale-105',
                isOutOfStock && 'grayscale opacity-80'
              )}
              sizes="(max-width: 640px) 100vw, 192px"
              loader={sanityLoader}
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] flex items-center justify-center">
                <span className="text-xs font-semibold tracking-widest uppercase text-foreground bg-background/90 px-4 py-1.5 rounded-sm shadow-sm">
                  Sold Out
                </span>
              </div>
            )}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 left-3 h-8 w-8 rounded-md bg-background/90 hover:bg-background shadow-sm flex items-center justify-center transition-colors"
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-colors',
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground hover:text-foreground'
                )}
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    {product.isFeatured && (
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                    {isLowStock && (
                      <span className="text-[10px] font-medium tracking-wider uppercase text-amber-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {totalStock} left
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-semibold text-foreground">
                    {hasMultipleVariants && (
                      <span className="text-xs font-serif text-muted-foreground font-normal italic mr-1">from</span>
                    )}
                    Ksh {lowestPrice.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed max-w-2xl">
                {product.description}
              </p>
            </div>

            <div className="flex items-end justify-between mt-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                  <Tag className="h-3 w-3" />
                  {product.category?.name ?? 'Uncategorized'}
                </span>
              </div>
              <Button
                size="sm"
                className="rounded-md px-6 shadow-none hover:shadow-sm transition-all"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid mode
  return (
    <Card
      className={cn(
        'group cursor-pointer border-border/40 hover:border-primary/20 hover:shadow-lg transition-all duration-300 overflow-hidden bg-card rounded-md flex flex-col',
        isOutOfStock && 'opacity-75'
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image */}
        <div className="relative w-full aspect-4/3 overflow-hidden bg-muted/20">
          <Image
            src={image}
            alt={product.name}
            className={cn(
              'w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105',
              isOutOfStock && 'grayscale opacity-80'
            )}
            width={400}
            height={300}
            loader={sanityLoader}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.isFeatured && (
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-primary text-primary-foreground px-2.5 py-1 rounded shadow-sm">
                Featured
              </span>
            )}
            {isLowStock && (
              <span className="text-[10px] font-medium tracking-wider uppercase bg-background text-amber-600 border border-border/50 px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5">
                <AlertCircle className="h-3 w-3" />
                {totalStock} Left
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 bg-background/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="text-xs font-semibold tracking-widest uppercase text-foreground bg-background/90 px-4 py-1.5 rounded-sm shadow-sm">
                Sold Out
              </span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-20 h-8 w-8 rounded-md bg-background/90 hover:bg-background shadow-sm flex items-center justify-center transition-colors"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground hover:text-foreground'
              )}
            />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors flex-1">
              {product.name}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>

          <div className="mt-auto space-y-4 pt-4 border-t border-border/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3 w-3" />
                {product.category?.name ?? 'Uncategorized'}
              </span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-left">
                {hasMultipleVariants && (
                  <span className="block text-[10px] font-serif italic text-muted-foreground">from</span>
                )}
                <span className="text-lg font-semibold text-foreground">Ksh {lowestPrice.toLocaleString()}</span>
              </div>

              {/* Action moved into normal flow for better mobile accessibility */}
              <Button
                size="sm"
                variant={isOutOfStock ? 'outline' : 'default'}
                className="h-9 px-4 rounded-md"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                {isOutOfStock ? <Eye className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
