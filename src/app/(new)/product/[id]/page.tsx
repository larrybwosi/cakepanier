import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBasket, Heart, Wheat, Flame, Info } from 'lucide-react';
import { getCatalogProduct } from '@/lib/dealio/catalog';
import sanityLoader from '@/lib/sanity-loader';
import { notFound } from 'next/navigation';

// Shadcn UI Imports
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getCatalogProduct(id);
  } catch (error) {
    return notFound();
  }

  const price = product.variants?.[0]?.price || 0;
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800&auto=format&fit=crop';

  return (
    <>
      <main className="pt-32 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
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

                  {/* Add-ons - Simplified for now as it needs client-side state for real functionality */}
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
                  className="flex-1 h-16 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 gap-3"
                >
                  <ShoppingBasket className="w-5 h-5" />
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
        </div>

        {/* Baker's Notes Section */}
        <section className="mt-32 bg-muted/30 py-24">
          <div className="max-w-7xl mx-auto px-12">
            <div className="flex flex-col md:flex-row gap-16">
              <div className="flex-1 space-y-8">
                <h2 className="text-4xl font-bold tracking-tight">Baker's Notes</h2>
                <div className="space-y-8">
                  <div className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Wheat className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl">The Crumb</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Expect an irregular, open crumb structure with a soft, custard-like texture. The high hydration
                        levels (82%) ensure the interior stays moist for days.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-xl">The Crust</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Fired in our stone deck ovens, the 'ear' of the loaf is beautifully scorched, offering deep
                        notes of toasted hazelnut and dark caramel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-card rounded-2xl p-12 border border-border/50 shadow-sm flex flex-col justify-center relative overflow-hidden">
                <Info className="absolute -top-4 -right-4 w-24 h-24 text-primary/5 rotate-12" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">
                  Master Baker's Tip
                </span>
                <blockquote className="text-2xl font-serif italic text-foreground leading-relaxed relative">
                  "For the most honest experience, slice thickly and toast lightly on a cast iron pan before adding
                  nothing but a pinch of sea salt."
                </blockquote>
                <p className="mt-6 font-bold text-primary">— Elias Thorne</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pairings Section */}
        <section className="py-32 max-w-7xl mx-auto px-12">
          <h2 className="text-4xl font-bold tracking-tight text-center mb-16">Perfect Pairings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Wildflower Honey',
                desc: 'Locally sourced, floral sweetness that balances the sourdough tang.',
                price: 120,
                img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop',
              },
              {
                name: 'Cultured Butter',
                desc: 'Hand-churned with sea salt flakes. High butterfat content for richness.',
                price: 80,
                img: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop',
              },
              {
                name: 'Maldon Sea Salt',
                desc: 'Crunchy pyramid-shaped flakes to elevate every buttered slice.',
                price: 50,
                img: 'https://images.unsplash.com/photo-161308226503b-0f4014a7a339?q=80&w=800&auto=format&fit=crop',
              },
            ].map(item => (
              <div
                key={item.name}
                className="group bg-card border border-border/40 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    src={item.img}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-6 text-center space-y-3">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{item.desc}</p>
                  <Button
                    variant="link"
                    className="text-primary font-bold uppercase text-[10px] tracking-widest p-0 h-auto"
                  >
                    Add to Box +Ksh {item.price}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-muted/50 border-t border-border py-16 px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="text-xl font-bold tracking-tighter">Artisanal Flourish</div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              © 2026 Artisanal Flourish Bakery. Hand-kneaded with intention.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Shipping Info
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Wholesale
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Careers
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
