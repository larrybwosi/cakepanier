'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import type { DealioProduct, DealioVariant } from '@/lib/dealio/types';

interface Props {
  product: DealioProduct;
}

export function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<DealioVariant | null>(
    product.variants?.[0] ?? null,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState<'idle' | 'checking' | 'ok' | 'low' | 'out'>('idle');

  // Check real-time inventory whenever variant changes
  useEffect(() => {
    if (!selectedVariant) return;
    setInventoryStatus('checking');

    fetch('/api/dealio/inventory/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ variantId: selectedVariant.id }),
    })
      .then(r => r.json())
      .then(res => {
        const inv = res.data;
        if (!inv || !inv.isAvailable) {
          setInventoryStatus('out');
        } else if (inv.isLowStock) {
          setInventoryStatus('low');
        } else {
          setInventoryStatus('ok');
        }
      })
      .catch(() => setInventoryStatus('idle'));
  }, [selectedVariant?.id]);

  const handleAddToCart = async () => {
    if (!selectedVariant || inventoryStatus === 'out') return;
    setIsAdding(true);

    if (navigator.vibrate) navigator.vibrate(50);

    const success = await addToCart({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      variantPrice: selectedVariant.price,
      addOns: [],
      productImage: product.images?.find(i => i.isPrimary)?.url ?? product.images?.[0]?.url,
    });

    if (success && navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    setIsAdding(false);
  };

  const primaryImage =
    product.images?.find(i => i.isPrimary)?.url ??
    product.images?.[0]?.url ??
    '/placeholder.svg?height=500&width=600';

  return (
    <div className="min-h-screen">
      <main className="pt-20">
        {/* Desktop back button */}
        <div className="container mx-auto px-4 py-6 hidden md:block">
          <Button variant="ghost" onClick={() => router.push('/products')} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>

        {/* Mobile back button */}
        <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border/50 md:hidden">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/products')}
              className="p-2 -ml-2 min-h-11 min-w-11 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-display font-semibold text-lg text-foreground truncate px-4 max-w-[60%]">
              {product.name}
            </h1>
            <div className="w-11" />
          </div>
        </div>

        <div className="h-14 md:hidden" />

        <div className="container mx-auto px-4 pb-24 md:pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                  Featured
                </Badge>
              )}
              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {/* Thumbnail gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 rounded-lg overflow-hidden border-2 border-border"
                    >
                      <img
                        src={img.url}
                        alt={img.alt ?? `${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                    {product.name}
                  </h1>
                  <Button variant="ghost" size="sm" className="p-2 shrink-0">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <Badge variant="outline">{product.category?.name ?? 'Uncategorized'}</Badge>
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Select Option</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.isAvailable}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : !variant.isAvailable
                            ? 'border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                            : 'border-border bg-background text-foreground hover:border-primary'
                        }`}
                      >
                        {variant.name}
                        <span className="block text-xs opacity-75 mt-0.5">
                          Ksh {variant.price.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              {selectedVariant && (
                <div className="text-3xl font-bold text-primary">
                  Ksh {selectedVariant.price.toLocaleString()}
                </div>
              )}

              {/* Inventory Status */}
              {inventoryStatus === 'low' && (
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">
                    Only {selectedVariant?.totalStock} left in stock
                  </span>
                </div>
              )}
              {inventoryStatus === 'out' && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">Out of stock for this option</span>
                </div>
              )}
              {inventoryStatus === 'ok' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">In stock</span>
                </div>
              )}

              {/* SKU */}
              {selectedVariant?.sku && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  <span>SKU: {selectedVariant.sku}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  size="lg"
                  variant="hero"
                  className="flex-1"
                  disabled={isAdding || inventoryStatus === 'out' || !selectedVariant}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {isAdding ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
