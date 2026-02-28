import { Star, Heart, ShoppingCart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type { DealioProduct } from "@/lib/dealio/types";

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
    if (onClick) {
      onClick();
    } else {
      router.push(`/products/${product.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(product.id);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  return (
    <Card
      className={`group cursor-pointer hover:shadow-lg transition-all duration-300 ${
        isOutOfStock ? "opacity-60" : ""
      } ${viewMode === "list" ? "flex flex-row" : ""}`}
      onClick={handleCardClick}
    >
      <CardContent
        className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}
      >
        {/* Image Section */}
        <div
          className={`relative overflow-hidden ${
            viewMode === "list"
              ? "w-48 h-full shrink-0 rounded-l-lg"
              : "w-full h-48 rounded-t-lg"
          }`}
        >
          {/* Badge Container */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
            {product.isFeatured && (
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary">
                Featured
              </Badge>
            )}
            {isLowStock && (
              <Badge className="bg-amber-500 text-white border-none flex items-center gap-1 shadow-sm">
                <AlertCircle className="h-3 w-3" /> Low Stock
              </Badge>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[1px] flex items-center justify-center">
              <Badge
                variant="destructive"
                className="uppercase tracking-widest px-3 py-1"
              >
                Out of Stock
              </Badge>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-20 p-1 h-8 w-8 bg-background/80 hover:bg-background rounded-full shadow-sm"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
          <img
            src={image}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? "grayscale" : ""}`}
          />
        </div>

        {/* Info Section */}
        <div className={`p-4 space-y-3 ${viewMode === "list" ? "flex-1" : ""}`}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-display font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              {isLowStock && (
                <p className="text-[10px] font-bold text-amber-600 uppercase mt-0.5">
                  Only {totalStock} left in stock
                </p>
              )}
            </div>
            <span className="text-lg font-bold text-primary shrink-0 ml-2">
              {hasMultipleVariants ? "From " : ""}Ksh{" "}
              {lowestPrice.toLocaleString()}
            </span>
          </div>

          <p
            className={`text-muted-foreground text-sm leading-relaxed ${
              viewMode === "list" ? "line-clamp-2" : "line-clamp-3"
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
            <Badge variant="outline" className="text-[10px] font-normal">
              {product.category?.name ?? "Uncategorized"}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isOutOfStock}
              onClick={handleViewDetails}
            >
              {isOutOfStock ? "Sold Out" : "View Details"}
            </Button>
            <Button size="sm" disabled={isOutOfStock} onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
