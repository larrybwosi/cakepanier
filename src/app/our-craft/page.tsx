import Image from 'next/image';
import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google';

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export default function OurCraft() {
  return (
    <div
      className={`${notoSerif.variable} ${plusJakarta.variable} font-sans bg-[#fdf9f0] text-[#1c1c17] min-h-screen selection:bg-[#e2e2b4] selection:text-[#8f4900]`}
    >
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6 absolute top-0 left-0 right-0 z-50 text-white">
        {/* We use white text here to contrast over the dark hero image */}
        <div className="font-serif text-2xl font-bold tracking-tight text-white drop-shadow-md">Artisanal Flourish</div>
        <nav className="flex gap-8 text-sm font-medium drop-shadow-md">
          <a href="#" className="hover:text-[#e2e2b4] transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-[#e2e2b4] transition-colors">
            Menu
          </a>
          <a href="#" className="text-white border-b-2 border-white pb-1">
            Our Craft
          </a>
          <a href="#" className="hover:text-[#e2e2b4] transition-colors">
            Cakes
          </a>
          <a href="#" className="hover:text-[#e2e2b4] transition-colors">
            Find Us
          </a>
        </nav>
        <button className="bg-[#8f4900] text-white px-6 py-2 rounded-md font-medium text-sm hover:opacity-90 transition-opacity border border-white/20 shadow-lg">
          Order Now
        </button>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative w-full h-[70vh] min-h-[600px] flex items-center justify-center text-center">
          <Image
            src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop"
            alt="Baker dusting flour"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 max-w-3xl px-6 mt-16">
            <span className="bg-[#e2e2b4] text-[#1c1c17] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md mb-6 inline-block shadow-sm">
              The Rhythm of Grain
            </span>
            <h1 className="font-serif text-white text-5xl md:text-7xl mb-6 leading-[1.1] drop-shadow-lg">
              Crafted by Hand,
              <br />
              Perfected by Time
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Discover the alchemy of flour, water, and wild yeasts. Informed through patience, tradition, and an
              unrelenting commitment to local harvests.
            </p>
          </div>
        </section>

        {/* SECTION 1: 72-Hour Ferment (Asymmetric Left Image) */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=1000&auto=format&fit=crop"
                alt="Active sourdough starter bubbling"
                fill
                className="object-cover"
              />
            </div>
            <div className="max-w-lg">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8f4900] mb-4">Our Process</p>
              <h2 className="font-serif text-[#1c1c17] text-4xl mb-6 leading-tight">The 72-Hour Ferment</h2>
              <p className="text-[#1c1c17]/70 leading-relaxed mb-8">
                We don't believe in shortcuts. Every loaf at Artisanal Flourish undergoes a rigorous cold-fermentation
                process spanning three days. This patient waiting period allows wild yeasts to break down complex
                starches, resulting in a bread that is not only deeper in flavor, but significantly easier on the
                digestive system.
              </p>
              <blockquote className="border-l-2 border-[#8f4900]/30 pl-6 italic text-[#1c1c17]/80 font-serif text-lg">
                "Time is our most valuable ingredient. You cannot rush the song of the sourdough."
              </blockquote>
            </div>
          </div>
        </section>

        {/* SECTION 2: Local Soil (Asymmetric Right Image) */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="max-w-lg order-2 md:order-1">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8f4900] mb-4">Sourcing</p>
              <h2 className="font-serif text-[#1c1c17] text-4xl mb-6 leading-tight">Rooted in Local Soil</h2>
              <p className="text-[#1c1c17]/70 leading-relaxed mb-8">
                Our flour doesn't come from massive industrial mills. We partner exclusively with regional farmers who
                practice regenerative agriculture. These heirloom grains are stone-ground in small batches to preserve
                the germ and bran—the living heart of the wheat—ensuring every bite is packed with nutrients and the
                unique terroir of our valley.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-[#e2e2b4] text-[#1c1c17] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                  Organic Heirloom
                </span>
                <span className="bg-[#e2e2b4] text-[#1c1c17] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                  Stone Ground
                </span>
                <span className="bg-[#e2e2b4] text-[#1c1c17] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md">
                  Zero Additives
                </span>
              </div>
            </div>
            <div className="relative h-[600px] w-full rounded-xl overflow-hidden shadow-sm order-1 md:order-2">
              <Image
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop"
                alt="Hands holding raw wheat grains"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: The Story (Bento Grid) */}
        <section className="bg-[#f7f3ea] py-24 px-6 border-t border-b border-[#dbc2b0]/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#8f4900] mb-4">Our Story</p>
              <h2 className="font-serif text-[#1c1c17] text-4xl leading-tight">Meet the Hands Behind the Flour</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Top Left: Master Baker */}
              <div className="md:col-span-8 relative rounded-xl overflow-hidden h-[400px] shadow-sm group cursor-pointer">
                <Image
                  src="https://images.unsplash.com/photo-1586444248902-2f64eddc13bf?q=80&w=1200&auto=format&fit=crop"
                  alt="Master Baker scoring dough"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white max-w-lg">
                  <h3 className="font-serif text-3xl mb-3">Master Baker Elias Thorne</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    With three decades of experience and a lineage of traditional bakers, Elias brings an unparalleled
                    intuitive touch to our small team.
                  </p>
                  <span className="text-sm font-bold flex items-center gap-2 hover:text-[#e2e2b4] transition-colors">
                    Read Elias's Journey <span>→</span>
                  </span>
                </div>
              </div>

              {/* Top Right: Sustainability */}
              <div className="md:col-span-4 bg-[#8f4900] rounded-xl p-10 text-white flex flex-col justify-center items-center text-center shadow-sm">
                <svg className="w-8 h-8 mb-6 text-[#e2e2b4]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                </svg>
                <h3 className="font-serif text-2xl mb-4">Sustainable Future</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  Our bakery operates on 100% renewable energy and we compost all organic waste, returning it to the
                  very farms that grow our wheat.
                </p>
              </div>

              {/* Bottom Left: Crumb Lab */}
              <div className="md:col-span-4 bg-[#ffffff] rounded-xl p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-[#1c1c17] text-xl mb-2">The Crumb Lab</h3>
                  <p className="text-[#1c1c17]/70 text-sm mb-6">
                    Where we experiment with wild inclusions, local honey, and toasted hazelnuts.
                  </p>
                </div>
                <div className="relative h-32 w-full rounded-md overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1586443657497-6a1bd1cb33ed?q=80&w=600&auto=format&fit=crop"
                    alt="Jars of ingredients"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Bottom Right: Workshop */}
              <div className="md:col-span-8 bg-[#ffffff] rounded-xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="font-serif text-[#1c1c17] text-2xl mb-3">Join Our Workshop</h3>
                  <p className="text-[#1c1c17]/70 text-sm leading-relaxed mb-6 max-w-md">
                    Want to learn the secret of the sourdough? We host weekend workshops for aspiring bakers to master
                    the art of the hand-knead.
                  </p>
                  <button className="bg-[#8f4900] text-white px-6 py-2.5 rounded-md font-bold text-sm hover:opacity-90 transition-opacity">
                    View Schedule
                  </button>
                </div>
                <div className="relative h-40 w-40 shrink-0 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(28,28,23,0.08)]">
                  <Image
                    src="https://images.unsplash.com/photo-1621236378699-8597faf6a176?q=80&w=400&auto=format&fit=crop"
                    alt="Hands kneading dough"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: Freshly Baked (Stats block) */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="max-w-md">
              <h2 className="font-serif text-[#1c1c17] text-4xl mb-6 leading-tight">
                Freshly Baked,
                <br />
                Daily at Dawn
              </h2>
              <p className="text-[#1c1c17]/70 leading-relaxed mb-10">
                Our ovens begin their work while the world is still asleep. We bake in small, intentional batches to
                ensure that every loaf you carry home is as warm and vibrant as the sun rising over our local fields.
              </p>
              <div className="flex gap-12 border-t border-[#dbc2b0]/30 pt-8">
                <div>
                  <div className="text-3xl font-serif text-[#8f4900] mb-1">04:00</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#1c1c17]/50">Oven Fired</div>
                </div>
                <div>
                  <div className="text-3xl font-serif text-[#8f4900] mb-1">120+</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#1c1c17]/50">Loaves Daily</div>
                </div>
              </div>
            </div>
            <div className="relative h-[450px] w-full rounded-xl overflow-hidden shadow-sm">
              <Image
                src="https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=1200&auto=format&fit=crop"
                alt="Fresh baked bread cooling"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER SECTION */}
      <footer className="bg-[#f1eee5] py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="font-serif text-[#1c1c17] text-xl font-bold mb-4">Artisanal Flourish</h2>
            <p className="text-[#1c1c17]/60 text-xs max-w-xs leading-relaxed">
              Crafting traditional breads and modern pastries in the heart of Old Town since 2012.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8f4900] mb-4">Navigation</h3>
            <ul className="text-xs text-[#1c1c17]/70 space-y-3">
              <li>
                <a href="#" className="hover:text-[#8f4900] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8f4900] transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="#" className="text-[#8f4900] font-bold">
                  Our Craft
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#8f4900] transition-colors">
                  Find Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8f4900] mb-4">Connect</h3>
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
        </div>

        <div className="max-w-7xl mx-auto mt-16 text-center text-[11px] text-[#1c1c17]/40">
          <p>© 2024 Artisanal Flourish Bakery. Hand-kneaded with love.</p>
        </div>
      </footer>
    </div>
  );
}
