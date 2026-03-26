import React from 'react';
import Link from 'next/link';
import { Wheat, Flame, Info } from 'lucide-react';
import { getCatalogProduct } from '@repo/lib/dealio/catalog';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';
import Image from 'next/image';

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

  return (
    <>
      <main className="pt-32 pb-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
           <ProductDetailClient product={product} />
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
