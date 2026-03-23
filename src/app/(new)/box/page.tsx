import Image from 'next/image';
import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google';

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export default function YourBox() {
  return (
    <div
      className={`${notoSerif.variable} ${plusJakarta.variable} font-sans bg-[#fdf9f0] text-[#1c1c17] min-h-screen pb-20 md:pb-0`}
    >
      <main className="max-w-7xl mx-auto px-4 md:px-6">
        {/* PAGE TITLE */}
        <div className="mb-8 md:mb-12 mt-4 md:mt-0">
          <h1 className="font-serif text-[#1c1c17] text-4xl md:text-5xl font-bold md:italic mb-2 md:mb-4">Your Box</h1>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.15em] font-bold text-[#1c1c17]/50">
            Review your selection for today's pickup
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: Items & Add-ons */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
            {/* CART ITEMS LIST */}
            <div className="flex flex-col gap-4">
              {/* Item 1 */}
              <div className="bg-[#f1eee5] rounded-xl p-4 md:p-6 relative group">
                <button className="absolute top-4 right-4 text-[#1c1c17]/40 hover:text-[#1c1c17] md:hidden">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                  <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1589367920969-ab8e050bf0ef?q=80&w=400&auto=format&fit=crop"
                      alt="Signature Sourdough"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-lg md:text-xl text-[#1c1c17]">Signature Sourdough</h3>
                      <span className="font-serif text-[#8f4900] md:text-lg font-medium hidden md:block">$18.00</span>
                    </div>
                    <p className="text-xs text-[#1c1c17]/60 mb-3">Wild-yeast fermented for 48 hours</p>
                    <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                      <span className="bg-[#e2e2b4] text-[#1c1c17] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        Vegan
                      </span>
                      <span className="bg-[#e5dfd1] text-[#1c1c17] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        Organic
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end md:gap-4 mt-2 md:mt-0">
                    <span className="font-serif text-[#8f4900] text-lg font-medium md:hidden">$9.50</span>
                    <div className="flex items-center bg-[#fdf9f0] rounded-md overflow-hidden border border-[#dbc2b0]/30 shadow-sm">
                      <button className="px-3 py-1.5 text-[#8f4900] hover:bg-[#dbc2b0]/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span className="px-2 font-bold text-[#1c1c17] text-sm min-w-[2ch] text-center">2</span>
                      <button className="px-3 py-1.5 text-[#8f4900] hover:bg-[#dbc2b0]/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-[#f1eee5] rounded-xl p-4 md:p-6 relative group">
                <button className="absolute top-4 right-4 text-[#1c1c17]/40 hover:text-[#1c1c17] md:hidden">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center">
                  <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=400&auto=format&fit=crop"
                      alt="Classic Croissant"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-lg md:text-xl text-[#1c1c17]">Classic Croissant</h3>
                      <span className="font-serif text-[#8f4900] md:text-lg font-medium hidden md:block">$4.50</span>
                    </div>
                    <p className="text-xs text-[#1c1c17]/60 mb-3">Grass-fed butter, 27 delicate layers</p>
                    <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                      <span className="bg-[#e2e2b4] text-[#1c1c17] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        Buttery
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full md:w-auto md:flex-col md:items-end md:gap-4 mt-2 md:mt-0">
                    <span className="font-serif text-[#8f4900] text-lg font-medium md:hidden">$4.75</span>
                    <div className="flex items-center bg-[#fdf9f0] rounded-md overflow-hidden border border-[#dbc2b0]/30 shadow-sm">
                      <button className="px-3 py-1.5 text-[#8f4900] hover:bg-[#dbc2b0]/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span className="px-2 font-bold text-[#1c1c17] text-sm min-w-[2ch] text-center">1</span>
                      <button className="px-3 py-1.5 text-[#8f4900] hover:bg-[#dbc2b0]/20 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RECOMMENDED ADD-ONS */}
            <div>
              <h2 className="font-serif text-[#1c1c17] text-2xl md:text-3xl italic mb-6">Recommended Add-ons</h2>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Add-on 1 */}
                <div className="bg-[#f1eee5] p-3 md:p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center md:justify-between group cursor-pointer hover:bg-[#e8ece3] transition-colors">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full">
                    <div className="relative w-full md:w-16 aspect-square shrink-0 rounded-lg overflow-hidden shadow-sm">
                      <Image
                        src="https://images.unsplash.com/photo-1599598425947-33004bb15099?q=80&w=300&auto=format&fit=crop"
                        alt="Wild Raspberry Jam"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h4 className="font-serif text-sm md:text-base text-[#1c1c17] mb-1">Wild Raspberry Jam</h4>
                      <p className="font-bold text-[#8f4900] text-xs md:text-sm">$9.00</p>
                    </div>
                  </div>
                  <button className="bg-[#8f4900] text-white p-1.5 rounded-md hover:opacity-90 transition-opacity mt-2 md:mt-0 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </button>
                </div>

                {/* Add-on 2 */}
                <div className="bg-[#f1eee5] p-3 md:p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center md:justify-between group cursor-pointer hover:bg-[#e8ece3] transition-colors">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 w-full">
                    <div className="relative w-full md:w-16 aspect-square shrink-0 rounded-lg overflow-hidden shadow-sm">
                      <Image
                        src="https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=300&auto=format&fit=crop"
                        alt="Sea Salt Butter"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h4 className="font-serif text-sm md:text-base text-[#1c1c17] mb-1">Sea Salt Butter</h4>
                      <p className="font-bold text-[#8f4900] text-xs md:text-sm">$6.50</p>
                    </div>
                  </div>
                  <button className="bg-[#8f4900] text-white p-1.5 rounded-md hover:opacity-90 transition-opacity mt-2 md:mt-0 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* MOBILE ONLY: Eco Note inside content flow */}
            <div className="flex md:hidden items-start gap-3 bg-[#e8ece3]/50 p-4 rounded-xl text-[#1c1c17]/70 text-xs">
              <svg className="w-4 h-4 shrink-0 text-[#60613c] mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              <p>COMPOSTABLE & SEED-INFUSED PACKAGING</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Summary & Actions (Desktop Sidebar / Mobile Bottom) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 w-full pb-8 md:pb-0">
            {/* The Summary Card */}
            <div className="bg-[#f1eee5] rounded-xl p-6 md:p-8 flex flex-col gap-6 md:shadow-sm">
              <h2 className="font-serif text-[#1c1c17] text-2xl hidden md:block">Summary</h2>

              <div className="space-y-4 text-sm border-b md:border-t-0 border-[#dbc2b0]/30 pb-6 md:pt-0">
                <div className="flex justify-between items-center text-[#1c1c17]/80">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1c1c17] md:font-normal">$22.50</span>
                </div>
                <div className="flex justify-between items-center text-[#1c1c17]/80">
                  <span>Estimated Tax</span>
                  <span className="font-bold text-[#1c1c17] md:font-normal">$1.85</span>
                </div>
                <div className="flex justify-between items-center text-[#1c1c17]/80">
                  <span>Pickup Fee</span>
                  <span className="font-bold text-[#60613c]">FREE</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-2">
                <span className="font-serif text-[#1c1c17] text-2xl md:text-xl font-bold md:font-normal">Total</span>
                <span className="font-serif text-[#8f4900] text-2xl md:text-3xl font-bold md:font-normal">$24.35</span>
              </div>

              {/* Pickup Location Card (Inside summary for Desktop, acts as standalone section in mobile flow) */}
              <div className="bg-[#fdf9f0] md:bg-white p-4 rounded-xl flex gap-4 items-center border border-[#dbc2b0]/30 shadow-sm mt-2 md:mt-0">
                <div className="bg-[#e5dfd1] md:bg-[#f1eee5] p-2 rounded-md text-[#8f4900]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#1c1c17]/50 mb-0.5">
                    Pickup Location
                  </p>
                  <p className="text-[#1c1c17] text-sm font-bold">West Village Atelier</p>
                  <p className="text-[#1c1c17]/60 text-xs hidden md:block">42 Artisan Way, Manhattan</p>
                </div>
              </div>

              <button className="w-full bg-[#8f4900] text-white py-4 rounded-md font-bold text-sm md:text-base hover:bg-[#b35e04] transition-colors shadow-[0_4px_12px_rgba(143,73,0,0.2)] flex justify-center items-center gap-2 mt-4 md:mt-0">
                Proceed to Pickup
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>

              <p className="text-center text-[10px] uppercase tracking-wider font-bold text-[#1c1c17]/40 hidden md:block mt-2">
                Orders are typically ready within 15 minutes of scheduled time.
              </p>
            </div>

            {/* DESKTOP ONLY: Eco Note */}
            <div className="hidden md:flex items-start gap-4 bg-[#e8ece3] p-5 rounded-xl border border-[#dbc2b0]/20">
              <svg className="w-5 h-5 shrink-0 text-[#60613c] mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              <p className="text-[#1c1c17]/80 text-xs leading-relaxed">
                Your box uses 100% compostable packaging and plant-based inks. Kneaded with intention, wrapped with
                care.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 bg-[#f1eee5] py-12 px-6 border-t border-[#dbc2b0]/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left">
          <div className="font-serif text-[#1c1c17] text-lg font-bold">
            Artisanal
            <br className="hidden md:block" /> Flourish
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-xs text-[#1c1c17]/60 font-medium uppercase tracking-wider">
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Shipping Info
            </a>
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Wholesale
            </a>
            <a href="#" className="hover:text-[#8f4900] transition-colors">
              Careers
            </a>
          </div>

          <div className="text-[10px] uppercase tracking-widest text-[#1c1c17]/40 max-w-xs md:text-right">
            © 2024 Artisanal Flourish Bakery. Hand-kneaded with intention.
          </div>
        </div>
      </footer>
    </div>
  );
}
