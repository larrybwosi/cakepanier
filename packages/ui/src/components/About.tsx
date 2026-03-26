"use client";
import { Users, Clock, Heart, Award, Check } from 'lucide-react';
import { useBrand } from '@repo/ui/lib/brand-context';

const About = () => {
  const brand = useBrand();
  const stats = [
    {
      icon: Clock,
      number: '25+',
      label: 'Years of Experience',
    },
    {
      icon: Users,
      number: '10k+',
      label: 'Happy Customers',
    },
    {
      icon: Heart,
      number: '50+',
      label: 'Recipes Perfected',
    },
    {
      icon: Award,
      number: '12',
      label: 'Awards Won',
    },
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
                {brand.aboutTitleLine1}
                <span className="block text-primary font-serif italic font-light mt-1">{brand.aboutTitleLine2}</span>
              </h2>

              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>{brand.aboutDescription1}</p>
                <p>{brand.aboutDescription2}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h3 className="text-xl font-semibold text-foreground mb-5 uppercase tracking-wide text-sm">
                Our Commitment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Locally sourced ingredients',
                  'Traditional methods',
                  'Zero artificial preservatives',
                  'Sustainable packaging',
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="mt-0.5 shrink-0 w-5 h-5 bg-primary/10 rounded flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-foreground text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-card border border-border/50 p-8 rounded-lg shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/5 border border-primary/10 rounded-md mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-4xl font-display font-bold text-foreground mb-2 tracking-tight">{stat.number}</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 max-w-4xl mx-auto">
          <div className="relative bg-muted/30 border border-border/50 rounded-lg p-10 md:p-14 text-center">
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 text-8xl text-primary/10 font-serif leading-none select-none"
              aria-hidden="true"
            >
              "
            </div>

            <blockquote className="relative z-10 text-xl md:text-2xl lg:text-3xl font-serif text-foreground italic leading-relaxed mb-8">
              {brand.aboutDescription1.substring(0, 150)}...
            </blockquote>

            <div className="relative z-10 flex flex-col items-center justify-center space-y-1">
              <cite className="text-foreground font-semibold not-italic">{brand.founderName}</cite>
              <span className="text-primary text-sm font-medium uppercase tracking-widest">
                {brand.founderTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
