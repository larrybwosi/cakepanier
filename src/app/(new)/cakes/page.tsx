'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import {
  CalendarIcon,
  Upload,
  Palette,
  Leaf,
  Truck,
  Heart,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { submitCakesInquiry } from '@/lib/dealio/inquiry.actions';

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export default function CustomCakesPage() {
  const [date, setDate] = useState<Date>();
  const [occasion, setOccasion] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (date) formData.set('dateNeeded', format(date, 'yyyy-MM-dd'));
    if (occasion) formData.set('occasion', occasion);

    try {
      const result = await submitCakesInquiry(formData);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`${notoSerif.variable} ${plusJakarta.variable} font-sans bg-[#fdf9f0] text-[#1c1c17] min-h-screen selection:bg-[#e2e2b4] selection:text-[#8f4900]`}
    >
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/home" className="font-serif text-[#8f4900] text-2xl font-bold tracking-tight">Artisanal Flourish</Link>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/home" className="hover:text-[#8f4900] transition-colors">
            Home
          </Link>
          <Link href="/menu" className="hover:text-[#8f4900] transition-colors">
            Menu
          </Link>
          <Link href="/our-craft" className="hover:text-[#8f4900] transition-colors">
            Our Craft
          </Link>
          <Link href="/cakes" className="text-[#8f4900] border-b-2 border-[#8f4900] pb-1">
            Cakes
          </Link>
          <Link href="/findus" className="hover:text-[#8f4900] transition-colors">
            Find Us
          </Link>
        </nav>
        <button className="bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#8f4900] to-[#b35e04] text-white px-6 py-2.5 rounded-3xl font-medium text-sm shadow-[0_8px_32px_rgba(28,28,23,0.05)] hover:scale-[1.02] transition-transform">
          Order Now
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-32">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl">
            <span className="inline-block bg-[#e2e2b4] text-[#1c1c17] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-[16px_8px_16px_8px] mb-8 shadow-sm border border-[#60613c]/10 animate-fade-in-down">
              Bespoke Confections
            </span>
            <h1 className="font-serif text-[#8f4900] text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Let us Bake Something Special
            </h1>
            <p className="text-[#1c1c17]/80 text-lg leading-relaxed italic">
              From intimate celebrations to grand milestones, our custom cakes are designed to be the centerpiece of
              your story. Every layer hand-kneaded, every petal hand-piped.
            </p>
          </div>
          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square pl-4 pt-4">
            <div className="absolute top-0 right-4 bottom-4 left-8 bg-[#f1eee5] rounded-2xl z-0 border border-[#dbc2b0]/20"></div>
            <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.pexels.com/photos/7561024/pexels-photo-7561024.jpeg"
                alt="Custom layered cake"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* INQUIRY FORM SECTION */}
        <section className="bg-[#f1eee5] rounded-3xl p-8 md:p-16 border border-[#dbc2b0]/30 shadow-sm">
          {isSubmitted ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="bg-[#8f4900]/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-[#8f4900]">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="font-serif text-[#1c1c17] text-3xl font-bold mb-4">Inquiry Sent!</h2>
              <p className="text-[#1c1c17]/70 mb-8 leading-relaxed">
                Thank you for your inquiry. Our master pastry chef will review your request and get back to you via email within 24-48 hours.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-[#8f4900] hover:bg-[#7a3e00] text-white px-8 py-3 rounded-xl font-bold"
              >
                Send Another Inquiry
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="font-serif text-[#1c1c17] text-3xl md:text-4xl font-bold mb-3">Inquiry Form</h2>
                <p className="text-[#1c1c17]/70 text-sm">Share your vision with our master pastry chef.</p>
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider ml-1">Full Name</Label>
                  <Input
                    name="name"
                    required
                    placeholder="Your name"
                    className="bg-[#e5dfd1] border-transparent focus-visible:ring-[#8f4900]/30 h-12"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider ml-1">Email Address</Label>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="hello@example.com"
                    className="bg-[#e5dfd1] border-transparent focus-visible:ring-[#8f4900]/30 h-12"
                  />
                </div>

                {/* Occasion Select */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider ml-1">Occasion</Label>
                  <Select onValueChange={setOccasion}>
                    <SelectTrigger className="bg-[#e5dfd1] border-transparent h-12 focus:ring-[#8f4900]/30">
                      <SelectValue placeholder="Select an occasion" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#fdf9f0]">
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Picker (Calendar) */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider ml-1">Date Needed</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full h-12 justify-start text-left font-normal bg-[#e5dfd1] border-transparent hover:bg-[#dbd4c4]',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#fdf9f0]" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guest Count */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider ml-1">Number of Guests</Label>
                  <Input name="guests" placeholder="Estimated guest count" className="bg-[#e5dfd1] border-transparent h-12" />
                </div>

                {/* File Upload Placeholder */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider ml-1">Reference Images</Label>
                  <div className="grid w-full items-center gap-1.5 relative">
                    <Input
                      id="picture"
                      type="file"
                      disabled
                      className="bg-[#e5dfd1] border-transparent h-12 file:bg-transparent file:border-0 file:text-sm file:font-medium cursor-not-allowed opacity-50"
                    />
                    <Upload className="absolute right-4 top-3.5 h-5 w-5 text-[#1c1c17]/40 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-[#1c1c17]/50 italic ml-1">Image upload coming soon.</p>
                </div>

                {/* Textarea */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider ml-1">Flavor Preferences & Notes</Label>
                  <Textarea
                    name="notes"
                    placeholder="Tell us about flavors, dietary restrictions, or specific design ideas..."
                    className="bg-[#e5dfd1] border-transparent min-h-[120px] focus-visible:ring-[#8f4900]/30"
                  />
                </div>

                {error && (
                  <div className="col-span-1 md:col-span-2 text-red-500 text-sm font-bold text-center">
                    {error}
                  </div>
                )}

                <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-[#8f4900] hover:bg-[#7a3e00] text-white px-12 py-6 text-md font-bold rounded-xl shadow-xl shadow-[#8f4900]/10 transition-transform active:scale-95 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Inquiry'
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </section>

        {/* FEATURES GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Custom Design',
              desc: "Every cake is a blank canvas. We work closely with you to match your event's theme perfectly.",
              icon: <Palette className="w-5 h-5" />,
            },
            {
              title: 'Organic Ingredients',
              desc: 'We source local flour, farm-fresh eggs, and seasonal fruits to ensure maximum flavor.',
              icon: <Leaf className="w-5 h-5" />,
            },
            {
              title: 'Handled with Care',
              desc: 'Our white-glove delivery ensures your masterpiece arrives safely and is set up perfectly.',
              icon: <Truck className="w-5 h-5" />,
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-8 shadow-sm border border-[#dbc2b0]/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="bg-[#fdf9f0] w-12 h-12 rounded-full flex items-center justify-center mb-6 text-[#8f4900] group-hover:bg-[#8f4900] group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-serif text-[#1c1c17] text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-[#1c1c17]/70 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#f1eee5] py-20 px-6 mt-12 border-t border-[#dbc2b0]/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h2 className="font-serif text-[#1c1c17] text-2xl font-bold">Artisanal Flourish</h2>
            <p className="text-[#1c1c17]/60 leading-relaxed text-sm">
              Crafting edible memories since 2012. Our bakery is built on the philosophy of slow craft and honest
              ingredients.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm font-semibold uppercase tracking-wider text-[#1c1c17]/70">
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Pinterest
            </a>
          </div>

          <div className="flex flex-col gap-3 text-sm font-semibold uppercase tracking-wider text-[#1c1c17]/70">
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Newsletter
            </a>
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Contact
            </a>
          </div>

          <div>
            <h3 className="font-bold text-[#1c1c17] mb-4 uppercase tracking-[0.2em] text-xs">Our Studio</h3>
            <p className="text-[#1c1c17]/70 leading-relaxed text-sm italic">
              123 Baker's Lane, Flourish District
              <br />
              San Francisco, CA 94110
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#dbc2b0]/20 text-center text-[10px] uppercase tracking-widest text-[#1c1c17]/40">
          © 2026 Artisanal Flourish Bakery. Hand-kneaded with <Heart className="inline w-2 h-2 text-[#8f4900]" />
        </div>
      </footer>
    </div>
  );
}
