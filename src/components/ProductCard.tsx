import { Star, Heart, ShoppingCart, AlertCircle, Eye, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type { DealioProduct } from "@/lib/dealio/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import sanityLoader from "@/lib/sanity-loader";

interface ProductCardProps {
  product: DealioProduct;
  viewMode?: "grid" | "list";
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  onClick?: () => void;
}

export function ProductCard({
  product,
  viewMode = "grid",
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: ProductCardProps) {
  const router = useRouter();

  const getLowestPrice = (product: DealioProduct): number => {
    if (!product.variants?.length) return 0;
    return Math.min(...product.variants.map((v) => v.price));
  };

  const getPrimaryImage = (product: DealioProduct): string => {
    return product.images?.[0] ?? "/placeholder.svg?height=300&width=400";
  };

  const getStockInfo = (product: DealioProduct) => {
    const totalStock =
      product.variants?.reduce((acc, v) => acc + (v.totalStock || 0), 0) ?? 0;
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

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "group cursor-pointer border border-border/50 hover:border-border hover:shadow-xl transition-all duration-300 overflow-hidden bg-card",
          isOutOfStock && "opacity-60",
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-0 flex w-full h-44">
          {/* Image */}
          <div className="relative w-44 shrink-0 overflow-hidden">
            <img
              src={image}
              alt={product.name}
              className={cn(
                "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out",
                isOutOfStock && "grayscale",
              )}
            />
            {/* Overlays */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/70 rotate-[-20deg] border border-foreground/20 px-3 py-1 rounded">
                  Sold Out
                </span>
              </div>
            )}
            {/* Favorite */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2.5 right-2.5 h-7 w-7 rounded-full bg-background/90 hover:bg-background shadow flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  isFavorite
                    ? "fill-rose-500 text-rose-500"
                    : "text-muted-foreground",
                )}
              />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
            <div className="space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {product.isFeatured && (
                      <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-primary">
                        Featured
                      </span>
                    )}
                    {isLowStock && (
                      <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-amber-500 flex items-center gap-1">
                        <AlertCircle className="h-2.5 w-2.5" /> {totalStock}{" "}
                        left
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-200">
                    {product.name}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  {hasMultipleVariants && (
                    <p className="text-[10px] text-muted-foreground">From</p>
                  )}
                  <p className="text-xl font-bold text-foreground">
                    Ksh {lowestPrice.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {product.category?.name ?? "Uncategorized"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs px-3"
                  disabled={isOutOfStock}
                  onClick={handleViewDetails}
                >
                  <Eye className="h-3 w-3 mr-1.5" />
                  View
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                  Add to Cart
                </Button>
              </div>
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
        "group cursor-pointer border border-border/50 hover:border-border hover:shadow-2xl transition-all duration-300 overflow-hidden bg-card",
        isOutOfStock && "opacity-60",
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out",
              isOutOfStock && "grayscale",
            )}
            width={400}
            height={300}
            loader={sanityLoader}
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isFeatured && (
              <span className="text-[9px] font-bold tracking-[0.15em] uppercase bg-primary text-primary-foreground px-2.5 py-1 rounded-full shadow-sm">
                Featured
              </span>
            )}
            {isLowStock && (
              <span className="text-[9px] font-bold tracking-[0.12em] uppercase bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <AlertCircle className="h-2.5 w-2.5" />
                Only {totalStock} left
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/70 border border-foreground/20 px-4 py-1.5 rounded rotate-[-8deg] bg-background/40">
                Sold Out
              </span>
            </div>
          )}

          {/* Favorite button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-background/90 hover:bg-background shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all",
                isFavorite
                  ? "fill-rose-500 text-rose-500"
                  : "text-muted-foreground",
              )}
            />
          </button>

          {/* Hover quick-action overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-background/95 to-background/60 backdrop-blur-sm px-4 py-3 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 h-8 text-xs font-medium"
              disabled={isOutOfStock}
              onClick={handleViewDetails}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Quick View
            </Button>
            <Button
              size="sm"
              className="h-8 px-3"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 space-y-3">
          {/* Name + Price */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200 flex-1">
              {product.name}
            </h3>
            <div className="text-right shrink-0">
              {hasMultipleVariants && (
                <p className="text-[9px] text-muted-foreground uppercase tracking-wide">
                  From
                </p>
              )}
              <p className="text-base font-bold text-foreground">
                Ksh {lowestPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {product.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-border/50">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-medium tracking-wide border border-border/60 rounded-full px-2.5 py-0.5">
              {product.category?.name ?? "Uncategorized"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
