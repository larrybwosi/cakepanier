'use client';
import { ChefHat, Clock, Award } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import Image from 'next/image';
import { useBrand } from '@repo/ui/lib/brand-context';

const Hero = () => {
  const brand = useBrand();
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt={brand.name}
          className="object-cover"
          fill
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/80 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <ChefHat className="h-7 w-7 text-primary" />
            <span className="text-primary font-serif italic tracking-widest text-sm uppercase">{brand.name}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-[1.1]">
            {brand.heroTitleLine1}
            <span className="block text-primary font-serif italic font-light mt-2">{brand.heroTitleLine2}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
            {brand.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6 rounded-md">
              View Our Menu
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-md bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background/80"
            >
              Visit Our Store
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2 bg-background/70 backdrop-blur-md border border-primary/10 rounded-md px-5 py-2.5 shadow-sm transition-transform hover:-translate-y-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">Fresh Daily</span>
            </div>
            <div className="flex items-center space-x-2 bg-background/70 backdrop-blur-md border border-primary/10 rounded-md px-5 py-2.5 shadow-sm transition-transform hover:-translate-y-1">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">Award Winning</span>
            </div>
            <div className="flex items-center space-x-2 bg-background/70 backdrop-blur-md border border-primary/10 rounded-md px-5 py-2.5 shadow-sm transition-transform hover:-translate-y-1">
              <ChefHat className="h-4 w-4 text-primary" />
              <span className="text-foreground font-medium">Artisan Crafted</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 opacity-70 hover:opacity-100 transition-opacity">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/60 rounded-md flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-primary rounded-sm"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
