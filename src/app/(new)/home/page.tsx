import Image from 'next/image';
import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import { getFeaturedCatalogProducts } from '@/lib/dealio/catalog';
import sanityLoader from '@/lib/sanity-loader';

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export default async function Home() {
  const { products = [] } = await getFeaturedCatalogProducts({ isFeatured: true, limit: 4 }).catch(() => ({
    products: [],
  }));

  return (
    <div
      className={`${notoSerif.variable} ${plusJakarta.variable} font-sans bg-[#fdf9f0] text-[#1c1c17] min-h-screen selection:bg-[#e2e2b4] selection:text-[#8f4900]`}
    >
      <main>
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Typography & CTAs */}
            <div className="max-w-lg">
              <span className="inline-block bg-[#e2e2b4] text-[#1c1c17] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-[16px_8px_16px_8px] mb-8">
                EST. 1994
              </span>
              <h1 className="font-serif text-[#1c1c17] text-6xl md:text-7xl leading-[1.05] mb-6">
                Baked Daily <br />
                with <em className="text-[#8f4900] italic">Love</em> & <br />
                Local Grains
              </h1>
              <p className="text-[#1c1c17]/70 text-lg leading-relaxed mb-10 max-w-md">
                Every loaf is a story of patience. 24-hour slow fermentation, and stone-milled heirloom grains from our
                neighboring farms.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/menu">
                  <button className="bg-[#8f4900] text-white px-8 py-3 rounded-md font-bold text-sm hover:scale-[1.02] shadow-[0_8px_32px_rgba(28,28,23,0.05)] transition-all">
                    Pre-order Now
                  </button>
                </Link>
                <Link href="/menu">
                  <button className="bg-transparent text-[#8f4900] border border-[#dbc2b0] px-8 py-3 rounded-md font-bold text-sm hover:bg-[#8f4900]/5 transition-colors">
                    Explore Menu
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Overlapping Image Composition */}
            <div className="relative h-[500px] lg:h-[650px] w-full mt-12 lg:mt-0">
              {/* Background accent shape mimicking the design's soft backdrop */}
              <div className="absolute top-10 right-0 w-3/4 h-[90%] bg-[#f1eee5] rounded-tl-[100px] rounded-br-[100px] -z-10"></div>

              {/* Main vertical image */}
              <div className="absolute top-0 right-4 w-4/5 h-[80%] rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(28,28,23,0.08)]">
                <Image
                  src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=1000&auto=format&fit=crop"
                  alt="Fresh artisan sourdough loaf"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Smaller floating image */}
              <div className="absolute bottom-4 left-0 w-3/5 h-[45%] rounded-xl overflow-hidden shadow-[24px_24px_64px_rgba(28,28,23,0.12)] border-[8px] border-[#fdf9f0]">
                <Image
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop"
                  alt="Baker's table with flour"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Decorative circle/badge */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#8f4900] rounded-full flex items-center justify-center text-white text-center p-4 shadow-xl z-20 scale-90 md:scale-100">
                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">
                  Stone Milled <br />
                  <span className="text-lg font-serif italic lowercase tracking-normal">Grains</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS SECTION */}
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-16">
              <div>
                <h2 className="font-serif text-[#1c1c17] text-4xl mb-4">Pull Warm From the Oven</h2>
                <p className="text-[#1c1c17]/60 max-w-sm">Our most-loved daily staples, crafted by hand.</p>
              </div>
              <Link href="/menu" className="text-[#8f4900] font-bold text-sm border-b border-[#8f4900] mt-6 md:mt-0">
                View Full Menu
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {products.map(product => (
                <Link key={product.id} href={`/product/${product.id}`} className="group cursor-pointer">
                  <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-sm mb-4">
                    <Image
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=800&auto=format&fit=crop'}
                      alt={product.name}
                      fill
                      loader={sanityLoader}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-serif text-lg text-[#1c1c17]">{product.name}</h3>
                    <span className="font-bold text-[#8f4900] text-sm">
                      {product.variants?.[0]?.price ? `Ksh ${product.variants[0].price}` : 'Price unavailable'}
                    </span>
                  </div>
                  <p className="text-xs text-[#1c1c17]/60 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </Link>
              ))}

              {products.length === 0 && [1, 2, 3, 4].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="relative h-64 w-full rounded-xl overflow-hidden shadow-sm mb-4 bg-gray-100 animate-pulse" />
                  <div className="h-6 w-3/4 bg-gray-100 animate-pulse mb-2" />
                  <div className="h-4 w-full bg-gray-100 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HERITAGE SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[600px] w-full rounded-xl overflow-hidden shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1586444248902-2f64eddc13bf?q=80&w=1000&auto=format&fit=crop"
                alt="Baker shaping dough on a wooden table"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-6 right-6 bg-[#8f4900] text-white px-6 py-4 rounded-xl shadow-lg font-serif text-lg tracking-wide z-10">
                Since 1994
              </div>
            </div>

            <div className="max-w-md">
              <h2 className="font-serif text-[#1c1c17] text-4xl mb-6 leading-tight">
                Heritage in Every Hand-Kneaded Loaf
              </h2>
              <p className="text-[#1c1c17]/70 leading-relaxed mb-8">
                Founded in a small kitchen nearly three decades ago, Artisanal Flourish began with a simple mission: to
                restore the integrity of bread. Today, we continue to honor the rhythm of the seasons and the patience
                of the craft.
              </p>
              <button className="bg-transparent text-[#8f4900] border border-[#dbc2b0] px-8 py-2.5 rounded-md font-bold text-sm hover:bg-[#8f4900]/5 transition-colors">
                Read Our Story
              </button>
            </div>
          </div>
        </section>

        {/* FERMENTATION HIGHLIGHT */}
        <section className="py-20 text-center px-6">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="bg-[#f1eee5] p-4 rounded-full text-[#8f4900] mb-6 shadow-sm">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <h2 className="font-serif text-[#1c1c17] text-3xl md:text-4xl mb-4">The Art of Slow Fermentation</h2>
            <p className="text-[#1c1c17]/70 leading-relaxed mb-8">
              We believe bread shouldn't be rushed. Our signature 24-hour slow fermentation process allows flavors to
              deepen naturally, resulting in a complex profile and a crust that truly sings.
            </p>
            <button className="bg-[#8f4900] text-white px-8 py-3 rounded-md font-bold text-sm hover:opacity-90 transition-opacity shadow-sm">
              Discover Our Craft
            </button>
          </div>
        </section>

        {/* NEWSLETTER SECTION (Dark Mode Contrast) */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
          <div className="bg-[linear-gradient(135deg,#2a2723_0%,#1c1c17_100%)] rounded-xl p-12 md:p-20 text-center shadow-lg relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#8f4900]/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="font-serif text-white text-3xl md:text-4xl mb-4 drop-shadow-sm">Stay in the Flour Loop</h2>
              <p className="text-white/70 text-sm max-w-md mx-auto mb-10">
                Get notified when warm pulls leave the oven, reserve our weekend seasonal specialties, and join local
                baking workshops.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-white/10 text-white border border-white/20 rounded-md px-4 py-3 outline-none text-sm placeholder:text-white/40 focus:border-[#e2e2b4] transition-colors"
                />
                <button className="bg-[#8f4900] text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-[#b35e04] transition-colors shadow-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#f1eee5] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="font-serif text-[#1c1c17] text-xl font-bold mb-4">Artisanal Flourish</h2>
            <p className="text-[#1c1c17]/60 text-xs max-w-xs leading-relaxed mb-6">
              Hand-kneading traditions into every crust since 1994.
            </p>
            <div className="flex gap-4 text-[#1c1c17]/40">
              {/* Decorative placeholders for social icons */}
              <div className="w-5 h-5 rounded-full border border-current"></div>
              <div className="w-5 h-5 rounded-full border border-current"></div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1c1c17] mb-4">Explore</h3>
            <ul className="text-xs text-[#1c1c17]/70 space-y-3">
              <li>
                <a href="#" className="hover:text-[#8f4900] transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8f4900] transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8f4900] transition-colors">
                  Newsletter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8f4900] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1c1c17] mb-4">Visit Us</h3>
            <div className="text-xs text-[#1c1c17]/70 leading-relaxed">
              <p>
                123 Sourdough Lane
                <br />
                Grain District, BR 10293
              </p>
              <p className="mt-2">Mon - Sun: 7am - 4pm</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 text-center text-[11px] text-[#1c1c17]/40">
          <p>© 2024 Artisanal Flourish Bakery. Hand-kneaded with love.</p>
        </div>
      </footer>
    </div>
  );
}
