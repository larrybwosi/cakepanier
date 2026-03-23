import Image from 'next/image';
import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google';

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export default function Home() {
  return (
    <div
      className={`${notoSerif.variable} ${plusJakarta.variable} font-sans bg-[#fdf9f0] text-[#1c1c17] min-h-screen selection:bg-[#e2e2b4] selection:text-[#8f4900]`}
    >
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="font-serif text-[#8f4900] text-2xl font-bold tracking-tight">Artisanal Flourish</div>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <a href="#" className="hover:text-[#8f4900] transition-colors">
            Home
          </a>
          <a href="#" className="text-[#8f4900] border-b-2 border-[#8f4900] pb-1">
            Menu
          </a>
          <a href="#" className="hover:text-[#8f4900] transition-colors">
            Our Craft
          </a>
          <a href="#" className="hover:text-[#8f4900] transition-colors">
            Cakes
          </a>
          <a href="#" className="hover:text-[#8f4900] transition-colors">
            Find Us
          </a>
        </nav>
        <button className="bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#8f4900] to-[#b35e04] text-white px-6 py-2.5 rounded-3xl font-medium text-sm shadow-[0_8px_32px_rgba(28,28,23,0.05)] hover:scale-[1.02] transition-transform">
          Order Now
        </button>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
          <h1 className="font-serif text-[#8f4900] text-5xl md:text-7xl mb-6">Our Daily Bake</h1>
          <p className="text-lg md:text-xl text-[#1c1c17]/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Hand-kneaded, long-fermented, and baked in stone hearths. Every item on our menu is a testament to the slow
            craft of traditional baking.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Artisan Breads', 'Pastries', 'Savory Bites', 'Coffee & Tea'].map(filter => (
              <button
                key={filter}
                className="bg-[#f1eee5] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#e2e2b4] transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* ARTISAN BREADS SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="font-serif text-[#8f4900] text-3xl mb-10">Artisan Breads</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bread Card 1 */}
            <div className="group cursor-pointer">
              <div className="bg-[#ffffff] rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(28,28,23,0.03)] transition-transform hover:-translate-y-1">
                <div className="relative h-64 w-full">
                  <div className="absolute top-4 left-4 z-10 bg-[#e2e2b4] text-[#1c1c17] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-[16px_8px_16px_8px]">
                    Vegan
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1589367920969-ab8e050bf0ef?q=80&w=800&auto=format&fit=crop"
                    alt="Signature Sourdough"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 px-2">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-serif text-xl text-[#8f4900]">Signature Sourdough</h3>
                  <span className="font-medium text-[#8f4900]">$9.50</span>
                </div>
                <p className="text-sm text-[#1c1c17]/70 leading-relaxed">
                  36-hour slow fermentation using our 50-year-old starter. Crisp crust with a soft, airy crumb.
                </p>
              </div>
            </div>

            {/* Bread Card 2 */}
            <div className="group cursor-pointer">
              <div className="bg-[#ffffff] rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(28,28,23,0.03)] transition-transform hover:-translate-y-1">
                <div className="relative h-64 w-full">
                  <div className="absolute top-4 left-4 z-10 bg-[#e2e2b4] text-[#1c1c17] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-[16px_8px_16px_8px]">
                    Vegan
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1598124146163-36819847286d?q=80&w=800&auto=format&fit=crop"
                    alt="Heritage Focaccia"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 px-2">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-serif text-xl text-[#8f4900]">Heritage Focaccia</h3>
                  <span className="font-medium text-[#8f4900]">$7.00</span>
                </div>
                <p className="text-sm text-[#1c1c17]/70 leading-relaxed">
                  Infused with cold-pressed olive oil, fresh rosemary, and smoked Maldon sea salt.
                </p>
              </div>
            </div>

            {/* Bread Card 3 */}
            <div className="group cursor-pointer">
              <div className="bg-[#ffffff] rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(28,28,23,0.03)] transition-transform hover:-translate-y-1">
                <div className="relative h-64 w-full">
                  <div className="absolute top-4 left-4 z-10 bg-[#e2e2b4] text-[#1c1c17] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-[16px_8px_16px_8px]">
                    GF Available
                  </div>
                  <Image
                    src="https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop"
                    alt="Seed & Grain Batard"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 px-2">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-serif text-xl text-[#8f4900]">Seed & Grain Batard</h3>
                  <span className="font-medium text-[#8f4900]">$11.00</span>
                </div>
                <p className="text-sm text-[#1c1c17]/70 leading-relaxed">
                  Loaded with flax, sunflower, and toasted pumpkin seeds. Dense and nutrient-rich.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SWEET PASTRIES SECTION - Using the "No-Line" Rule with Background Shift */}
        <section className="bg-[#f7f3ea] py-16 mt-12 rounded-[3rem] mx-4 md:mx-6 lg:mx-12">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-serif text-[#8f4900] text-3xl mb-10">Sweet Pastries</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured Left Card */}
              <div className="bg-[#ffffff] rounded-3xl p-6 shadow-[0_8px_32px_rgba(28,28,23,0.03)] flex flex-col justify-between">
                <div className="relative h-72 w-full rounded-2xl overflow-hidden mb-6">
                  <Image
                    src="https://images.unsplash.com/photo-1549996647-190b679b33d7?q=80&w=800&auto=format&fit=crop"
                    alt="Classic Butter Croissant"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="font-serif text-2xl text-[#8f4900]">Classic Butter Croissant</h3>
                    <span className="font-bold text-[#8f4900] text-xl">$4.75</span>
                  </div>
                  <p className="text-[#1c1c17]/70 mb-8 italic">
                    255 layers of laminated French butter. Each bite is a delicate, honey-colored cloud.
                  </p>
                  <button className="text-[#8f4900] font-bold text-sm flex items-center gap-2 hover:opacity-80 transition-opacity">
                    Add to Box <span>→</span>
                  </button>
                </div>
              </div>

              {/* Grid Right Cards */}
              <div className="grid grid-cols-2 gap-6">
                {/* Pastry 1 */}
                <div className="bg-[#ffffff] rounded-3xl p-4 shadow-[0_8px_32px_rgba(28,28,23,0.03)]">
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop"
                      alt="Pain au Chocolat"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-serif text-[#8f4900] text-lg">Pain au Chocolat</h4>
                  <span className="font-medium text-[#8f4900] text-sm">$5.25</span>
                </div>
                {/* Pastry 2 */}
                <div className="bg-[#ffffff] rounded-3xl p-4 shadow-[0_8px_32px_rgba(28,28,23,0.03)]">
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1509365465985-25d11c17e812?q=80&w=800&auto=format&fit=crop"
                      alt="Honey Cinnamon Roll"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-serif text-[#8f4900] text-lg">Honey Cinnamon Roll</h4>
                  <span className="font-medium text-[#8f4900] text-sm">$5.50</span>
                </div>
                {/* Pastry 3 */}
                <div className="bg-[#ffffff] rounded-3xl p-4 shadow-[0_8px_32px_rgba(28,28,23,0.03)] relative">
                  <div className="absolute top-6 left-6 z-10 bg-[#e2e2b4] text-[#1c1c17] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-[16px_8px_16px_8px]">
                    GF
                  </div>
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=800&auto=format&fit=crop"
                      alt="Wild Berry Muffin"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-serif text-[#8f4900] text-lg">Wild Berry Muffin</h4>
                  <span className="font-medium text-[#8f4900] text-sm">$4.25</span>
                </div>
                {/* Pastry 4 */}
                <div className="bg-[#ffffff] rounded-3xl p-4 shadow-[0_8px_32px_rgba(28,28,23,0.03)]">
                  <div className="relative h-32 w-full rounded-lg overflow-hidden mb-4">
                    <Image
                      src="https://images.unsplash.com/photo-1569864358642-9d1684040f43?q=80&w=800&auto=format&fit=crop"
                      alt="Artisan Macarons"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h4 className="font-serif text-[#8f4900] text-lg">Artisan Macarons</h4>
                  <span className="font-medium text-[#8f4900] text-sm">$12.50 box</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM SECTION: Savory & Coffee */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Savory Bites */}
            <div>
              <h2 className="font-serif text-[#8f4900] text-3xl mb-10">Savory Bites</h2>
              <div className="flex flex-col gap-8">
                {/* No dividers used, adhering to the "No-Divider" Rule */}
                <div className="flex gap-6 items-start">
                  <div className="relative h-20 w-24 shrink-0 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(28,28,23,0.05)]">
                    <Image
                      src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop"
                      alt="Spinach Galette"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-serif text-[#8f4900] text-lg">Spinach & Feta Galette</h4>
                      <span className="font-medium text-[#8f4900]">$8.50</span>
                    </div>
                    <p className="text-sm text-[#1c1c17]/70 leading-relaxed">
                      Rustic rye pastry filled with wilted organic spinach, barrel-aged feta, and toasted pine nuts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="relative h-20 w-24 shrink-0 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(28,28,23,0.05)]">
                    <Image
                      src="https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=800&auto=format&fit=crop"
                      alt="Avocado Toast"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-serif text-[#8f4900] text-lg">Smoked Avocado Toast</h4>
                      <span className="font-medium text-[#8f4900]">$12.00</span>
                    </div>
                    <div className="mb-2 inline-block bg-[#e2e2b4] text-[#1c1c17] text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-[16px_8px_16px_8px]">
                      Vegan
                    </div>
                    <p className="text-sm text-[#1c1c17]/70 leading-relaxed">
                      Signature sourdough topped with cold-smoked avocado, radish, and micro-cilantro.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coffee & Tea */}
            <div>
              <h2 className="font-serif text-[#8f4900] text-3xl mb-10">Coffee & Tea</h2>
              <div className="flex flex-col gap-6 mb-10">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h4 className="font-serif text-[#8f4900] text-lg">Velvet Flat White</h4>
                    <p className="text-xs text-[#1c1c17]/70 mt-1">
                      Ethically sourced Ethiopian beans, oat milk option available.
                    </p>
                  </div>
                  <span className="font-medium text-[#8f4900]">$4.50</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h4 className="font-serif text-[#8f4900] text-lg">Honey Lavender Latte</h4>
                    <p className="text-xs text-[#1c1c17]/70 mt-1">
                      House-made lavender syrup and local wildflower honey.
                    </p>
                  </div>
                  <span className="font-medium text-[#8f4900]">$5.75</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <div>
                    <h4 className="font-serif text-[#8f4900] text-lg">Cold Brew Steeped 24h</h4>
                    <p className="text-xs text-[#1c1c17]/70 mt-1">
                      Low acidity, notes of dark chocolate and stone fruit.
                    </p>
                  </div>
                  <span className="font-medium text-[#8f4900]">$5.00</span>
                </div>
              </div>

              {/* Newsletter Component mapped to surface-container and input rules */}
              <div className="bg-[#f1eee5] rounded-3xl p-8">
                <h4 className="font-serif text-[#8f4900] text-xl mb-2">Join our Bakers Club</h4>
                <p className="text-sm text-[#1c1c17]/70 mb-6">
                  Get notified when fresh batches leave the oven and receive exclusive weekend specials.
                </p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 bg-[#ffffff] rounded-xl px-4 py-2 border border-[#dbc2b0] border-opacity-15 focus:border-[#60613c] focus:border-opacity-40 focus:ring-0 outline-none text-sm placeholder:text-[#1c1c17]/40 transition-colors"
                  />
                  <button className="bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#8f4900] to-[#b35e04] text-white px-6 py-2 rounded-3xl font-medium text-sm shadow-[0_8px_32px_rgba(28,28,23,0.05)] hover:scale-[1.02] transition-transform">
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#fdf9f0] py-16 mt-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h2 className="font-serif text-[#8f4900] text-2xl font-bold mb-4">Artisanal Flourish</h2>
            <p className="text-[#1c1c17]/70 text-sm max-w-sm leading-relaxed">
              Elevating the everyday through the ancient art of fermentation. Visit our flagship oven in the heart of
              the city.
            </p>
          </div>
          <div>
            <h3 className="font-serif text-[#8f4900] font-bold mb-4">Connect</h3>
            <ul className="text-sm text-[#1c1c17]/70 space-y-2">
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
            </ul>
          </div>
          <div>
            <h3 className="font-serif text-[#8f4900] font-bold mb-4">Legal</h3>
            <ul className="text-sm text-[#1c1c17]/70 space-y-2">
              <li>
                <a href="#" className="hover:text-[#8f4900] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
            <div className="mt-6 text-sm text-[#1c1c17]/70">
              <p>123 Baker St., Flour District.</p>
              <p>Open Daily 7am — 4pm</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[#dbc2b0]/15 flex flex-col md:flex-row justify-between items-center text-xs text-[#1c1c17]/50">
          <p>© 2026 Artisanal Flourish Bakery. Hand-kneaded with love.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social icon placeholders */}
            <span className="w-5 h-5 bg-[#e2e2b4] rounded-full"></span>
            <span className="w-5 h-5 bg-[#e2e2b4] rounded-full"></span>
            <span className="w-5 h-5 bg-[#e2e2b4] rounded-full"></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
