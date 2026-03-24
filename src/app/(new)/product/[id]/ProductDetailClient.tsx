'use client';

import { ShoppingBasket, Heart, Wheat, Flame, Info, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import sanityLoader from '@/lib/sanity-loader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/hooks/useCart';
import type { DealioProduct } from '@/lib/dealio/types';

interface ProductDetailClientProps {
  product: DealioProduct;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const price = product.variants?.[0]?.price || 0;
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800&auto=format&fit=crop';
  const variantId = product.variants?.[0]?.id || product.id;

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addToCart(variantId, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
      {/* Image Gallery Section */}
      <div className="lg:col-span-7 relative">
        <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-sm relative">
          <Image
            alt={product.name}
            fill
            loader={sanityLoader}
            className="object-cover transition-transform duration-700 hover:scale-105"
            src={primaryImage}
          />
        </div>
        <div className="absolute -bottom-8 -right-8 hidden md:block w-48 h-48 bg-card rounded-xl p-3 shadow-2xl rotate-3 border border-border overflow-hidden">
          <Image
            alt="Detail"
            fill
            loader={sanityLoader}
            className="object-cover"
            src={product.images?.[1] || primaryImage}
          />
        </div>
      </div>

      {/* Product Info Section */}
      <div className="lg:col-span-5 space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Daily Batch: Limited
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-primary">Ksh {price}</span>
            <span className="text-sm text-muted-foreground line-through decoration-primary/30">
              Ksh {Math.round(price * 1.2)}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Configuration */}
          <div className="space-y-8 pt-6">
            {/* Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-widest">Slice Preference</Label>
              <Select defaultValue="unsliced">
                <SelectTrigger className="w-full h-14 rounded-xl border-border bg-card">
                  <SelectValue placeholder="Select Slicing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unsliced">Unsliced (Whole Loaf)</SelectItem>
                  <SelectItem value="thick">Thick Country Slices</SelectItem>
                  <SelectItem value="sandwich">Sandwich Thin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Add-ons */}
            <div className="space-y-3">
              <Label className="text-sm font-bold flex items-center gap-2">
                Artisanal Flourish
                <span className="text-[10px] font-normal italic text-muted-foreground">(Optional)</span>
              </Label>
              <div className="grid gap-2">
                {[
                  { id: 'salt', label: 'Extra Maldon Sea Salt', price: 50 },
                  { id: 'honey', label: 'Honey Glaze Brush', price: 100 },
                  { id: 'seeds', label: 'Toasted Pumpkin Seeds', price: 150 },
                ].map(addon => (
                  <div
                    key={addon.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox id={addon.id} />
                      <Label htmlFor={addon.id} className="text-sm cursor-pointer">
                        {addon.label}
                      </Label>
                    </div>
                    <span className="text-xs font-semibold text-primary">+Ksh {addon.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            disabled={isAdding}
            onClick={handleAddToCart}
            className="flex-1 h-16 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 gap-3"
          >
            {isAdding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ShoppingBasket className="w-5 h-5" />
            )}
            Add to Box
          </Button>
          <Button size="lg" variant="outline" className="h-16 w-16 rounded-xl p-0 border-border">
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        {/* Fast Facts */}
        <div className="pt-12 grid grid-cols-2 gap-8 border-t border-border/50">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Crust Type
            </span>
            <p className="font-serif italic text-foreground">Crunchy, Caramelized</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Fermentation
            </span>
            <p className="font-serif italic text-foreground">36-Hour Wild Yeast</p>
          </div>
        </div>
      </div>
    </div>
  );
}
