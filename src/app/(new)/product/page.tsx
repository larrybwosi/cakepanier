'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBasket, Heart, Wheat, Flame, ChevronRight, Info } from 'lucide-react';

// Shadcn UI Imports
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function ArtisanalFlourishPage() {
  const [basePrice, setBasePrice] = useState<number>(9.5);
  const [addons, setAddons] = useState<{ [key: string]: number }>({});

  const handleAddonToggle = (name: string, price: number, isChecked: boolean) => {
    setAddons(prev => {
      const newAddons = { ...prev };
      if (isChecked) {
        newAddons[name] = price;
      } else {
        delete newAddons[name];
      }
      return newAddons;
    });
  };

  const totalPrice = (basePrice + Object.values(addons).reduce((sum, cost) => sum + cost, 0)).toFixed(2);

  return (
    <>
      <main className="pt-32 pb-24 bg-background">
        <div className="max-w-(--breakpoint-2xl) mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Image Gallery Section */}
            <div className="lg:col-span-7 relative">
              <div className="aspect-4/5 overflow-hidden rounded-2xl bg-muted shadow-sm">
                <img
                  alt="Signature Sourdough Loaf"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-R4SxVu79Zv8KlMZq3VDme83JqoUdM8R4BZeOD9L0OFU1eUYDT-s7eZnI8KlW4qIf8SsFJvfiVxgsDkRNeYRM5oxMI0lsN3W6nMyamI-GWD6S1GLbt7x49lAv1TnLr-thSlpCl12Kh0hWTfhWN2mDUujzOxPPxxovIfUaSLynfVpuzzytrWLanmazKmr5RnFlmTZU-Kx4aLFEoWg9DKviNQYHhv_mRl6J6pKo8uqhdzIWw4WNmXNjMRNoTDLnSrG2jxQViZ8Xn8Q"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 hidden md:block w-48 h-48 bg-card rounded-xl p-3 shadow-2xl rotate-3 border border-border">
                <img
                  alt="Sourdough Texture"
                  className="w-full h-full object-cover rounded-lg"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoGDMbUJh7Oc_Aj1LegXlfNEY7URXLLV9aLn5wLdXp_pOZ4PC8th1K9FxUpafJa15LXBeAm1GS2SFKTGmxo0qVTBcdnjJhXDEII6k-UpWy_gUSgkfSR9_qUmLBvrUK8QSaguX_8pICFoOiHRpsBgxTYKFFYlQZoVi-IRZSJ2x2IE37__q_dkuVRoe3zCBNwcfppGsE7jqbys39FC7X_Kk5e4hxrq48EnkyAUJ976qtBL32Yg9TimEDZfSvbLfQYlV4fEJKgXLtsV0"
                />
              </div>
            </div>

            {/* Product Details Section */}
            <div className="lg:col-span-5 space-y-8">
              <nav className="flex items-center space-x-2 text-muted-foreground font-medium uppercase tracking-widest text-[10px]">
                <Link href="#" className="hover:text-primary transition-colors">
                  Breads
                </Link>
                <ChevronRight className="w-3 h-3" />
                <Link className="text-primary" href="#">
                  Signature Series
                </Link>
              </nav>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
                  Signature Sourdough
                </h1>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-serif italic text-primary">${totalPrice}</span>
                  <Badge variant="secondary" className="px-3 py-1 rounded-full uppercase tracking-tighter">
                    Vegan
                  </Badge>
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed italic">
                Our pride and joy. Each loaf is the result of a rigorous 36-hour slow fermentation process, allowing
                deep, complex flavors to develop naturally.
              </p>

              <Separator className="bg-border/50" />

              {/* Customization Options */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Personalize your Loaf
                  </h3>

                  {/* Loaf Size */}
                  <div className="space-y-3">
                    <Label className="text-sm font-bold">Loaf Size</Label>
                    <RadioGroup
                      defaultValue="9.5"
                      onValueChange={v => setBasePrice(parseFloat(v))}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="relative">
                        <RadioGroupItem value="9.5" id="size-std" className="peer sr-only" />
                        <Label
                          htmlFor="size-std"
                          className="flex flex-col p-4 border rounded-xl cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted transition-all"
                        >
                          <span className="text-sm font-bold">Standard</span>
                          <span className="text-xs text-muted-foreground">$9.50</span>
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem value="14.5" id="size-lg" className="peer sr-only" />
                        <Label
                          htmlFor="size-lg"
                          className="flex flex-col p-4 border rounded-xl cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted transition-all"
                        >
                          <span className="text-sm font-bold">Large</span>
                          <span className="text-xs text-muted-foreground">$14.50</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Slicing Style */}
                  <div className="space-y-3">
                    <Label htmlFor="slicing" className="text-sm font-bold">
                      Slicing Style
                    </Label>
                    <Select defaultValue="unsliced">
                      <SelectTrigger id="slicing" className="w-full h-12 rounded-xl border-border">
                        <SelectValue placeholder="Select slicing style" />
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
                        { id: 'salt', label: 'Extra Maldon Sea Salt', price: 0.5 },
                        { id: 'honey', label: 'Honey Glaze Brush', price: 1.0 },
                        { id: 'seeds', label: 'Toasted Pumpkin Seeds', price: 1.5 },
                      ].map(addon => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/50 transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={addon.id}
                              onCheckedChange={checked => handleAddonToggle(addon.id, addon.price, !!checked)}
                            />
                            <Label htmlFor={addon.id} className="text-sm cursor-pointer">
                              {addon.label}
                            </Label>
                          </div>
                          <span className="text-xs font-semibold text-primary">+${addon.price.toFixed(2)}</span>
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
          <div className="max-w-(--breakpoint-2xl) mx-auto px-12">
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
        <section className="py-32 max-w-(--breakpoint-2xl) mx-auto px-12">
          <h2 className="text-4xl font-bold tracking-tight text-center mb-16">Perfect Pairings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Wildflower Honey',
                desc: 'Locally sourced, floral sweetness that balances the sourdough tang.',
                price: 12,
                img: '2',
              },
              {
                name: 'Cultured Butter',
                desc: 'Hand-churned with sea salt flakes. High butterfat content for richness.',
                price: 8,
                img: '3',
              },
              {
                name: 'Maldon Sea Salt',
                desc: 'Crunchy pyramid-shaped flakes to elevate every buttered slice.',
                price: 5,
                img: '4',
              },
            ].map(item => (
              <div
                key={item.name}
                className="group bg-card border border-border/40 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={`http://googleusercontent.com/profile/picture/${item.img}`}
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
                    Add to Box +${item.price}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-muted/50 border-t border-border py-16 px-12">
        <div className="max-w-(--breakpoint-2xl) mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
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
