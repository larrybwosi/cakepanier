import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google';

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export default function FindUs() {
  return (
    <div
      className={`${notoSerif.variable} ${plusJakarta.variable} font-sans bg-[#fdf9f0] text-[#1c1c17] min-h-screen w-full overflow-x-hidden`}
    >
      {/* HEADER */}
      <header className="w-full px-6 md:px-12 lg:px-20 py-6 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#dbc2b0]/20 mb-12">
        <div className="font-serif text-[#8f4900] text-2xl font-bold tracking-tight text-center md:text-left">
          Artisanal Flourish
        </div>
        <nav className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm font-medium">
          <a href="#" className="hover:text-[#8f4900] transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-[#8f4900] transition-colors">
            Menu
          </a>
          <a href="#" className="hover:text-[#8f4900] transition-colors">
            Our Craft
          </a>
          <a href="#" className="hover:text-[#8f4900] transition-colors">
            Cakes
          </a>
          <a href="#" className="text-[#8f4900] border-b-2 border-[#8f4900] pb-1">
            Find Us
          </a>
        </nav>
        <button className="bg-[#8f4900] text-white px-6 py-2 rounded-md font-medium text-sm hover:opacity-90 transition-opacity w-full md:w-auto">
          Order Now
        </button>
      </header>

      <main className="w-full px-6 md:px-12 lg:px-20 mb-20">
        {/* TITLE & BLOCKQUOTE SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-12">
          <div className="w-full lg:w-1/2">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1c1c17]/60 mb-6">Visit the Hearth</p>
            <h1 className="text-5xl md:text-7xl font-serif text-[#1c1c17] leading-[1.1]">
              Where the dough <br className="hidden sm:block" /> rises daily.
            </h1>
          </div>
          <div className="w-full lg:w-1/3 border-l-2 border-[#8f4900]/30 pl-6 pb-2">
            <p className="italic text-[#1c1c17]/70 font-serif text-xl md:text-2xl leading-relaxed">
              "The smell of fresh rosemary bread is the best alarm clock in the neighborhood."
            </p>
          </div>
        </div>

        {/* INFO & MAP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full">
          {/* LEFT COLUMN: CARDS */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Operating Hours Card */}
            <div className="bg-[#f1eee5] rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[#8f4900] text-xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Operating Hours
              </h2>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-[#dbc2b0]/20 pb-4">
                  <span className="text-[#1c1c17]/80">Monday – Friday</span>
                  <span className="font-medium">7:00 AM — 6:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-[#dbc2b0]/20 pb-4">
                  <span className="text-[#1c1c17]/80">Saturday</span>
                  <span className="font-medium">8:00 AM — 5:00 PM</span>
                </li>
                <li className="flex justify-between text-[#8f4900]">
                  <span>Sunday</span>
                  <span className="font-bold">8:00 AM — 2:00 PM</span>
                </li>
              </ul>
              <p className="text-[11px] text-[#1c1c17]/50 mt-6 italic">
                * Arrive early for our Signature Sourdough, usually sold out by 11 AM.
              </p>
            </div>

            {/* Get in Touch Card */}
            <div className="bg-[#f1eee5] rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[#8f4900] text-xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                Get in Touch
              </h2>
              <div className="space-y-6 text-sm">
                <div className="flex gap-4 items-start">
                  <div className="bg-[#e5dfd1] p-2 rounded-md text-[#8f4900] shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#1c1c17]/60 mb-1">
                      Bakery Address
                    </p>
                    <p className="text-[#1c1c17]/90 leading-relaxed">
                      482 Heritage Lane, Old Town District
                      <br />
                      West Elm, CA 90210
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-[#e5dfd1] p-2 rounded-md text-[#8f4900] shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#1c1c17]/60 mb-1">
                      Phone Number
                    </p>
                    <p className="text-[#1c1c17]/90 leading-relaxed">(555) 824-2100</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Neighborhood Card */}
            <div className="bg-[#f1eee5] rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[#1c1c17] text-lg font-bold mb-4">Our Neighborhood</h2>
              <p className="text-sm text-[#1c1c17]/70 leading-relaxed mb-6">
                Nestled in the heart of Old Town, Artisanal Flourish sits just two blocks south of the Central Plaza.
                The area is known for its cobblestone streets and vibrant weekend flower market.
              </p>
              <div className="bg-[#fdf9f0] p-4 rounded-md flex gap-3 items-start border border-[#dbc2b0]/30">
                <div className="font-bold text-[#1c1c17] mt-0.5 shrink-0">P</div>
                <div>
                  <p className="text-xs font-bold text-[#1c1c17] mb-1">Parking Information</p>
                  <p className="text-[11px] text-[#1c1c17]/70 leading-relaxed">
                    Validated street parking is available for 30 minutes, or use the public garage on 5th Ave for longer
                    stays.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MAP AREA */}
          <div className="lg:col-span-8 bg-[#e8ece3] rounded-xl overflow-hidden relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] w-full">
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply bg-cover bg-center"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-[#8f4900] text-white text-xs font-bold px-4 py-2 rounded-md shadow-lg mb-2 whitespace-nowrap">
                Artisanal Flourish
              </div>
              <div className="text-[#8f4900] drop-shadow-md">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
            </div>

            <button className="absolute top-6 right-6 bg-[#8f4900] text-white px-4 py-2 rounded-md text-xs font-bold flex items-center gap-2 shadow-sm hover:opacity-90 transition-opacity">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 3L3 10.53v.98l6.84 2.65L12.48 21h.98L21 3z" />
              </svg>
              <span className="hidden sm:inline">Get Directions</span>
            </button>

            <div className="absolute bottom-6 right-6 flex flex-col bg-white rounded-md shadow-sm overflow-hidden text-[#1c1c17]">
              <button className="p-3 hover:bg-gray-50 border-b border-gray-100">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </button>
              <button className="p-3 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* NEWSLETTER SECTION */}
      <section className="w-full bg-[#f7f3ea] py-16 md:py-24 px-6 md:px-12 lg:px-20 text-center border-t border-[#dbc2b0]/20">
        <h2 className="font-serif text-[#1c1c17] text-3xl md:text-4xl mb-4 font-bold">Join our weekly loaf list.</h2>
        <p className="text-[#1c1c17]/70 text-sm max-w-md mx-auto mb-8 px-4">
          Subscribe to get notified about our seasonal specials, baking workshops, and holiday pre-order windows.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-lg mx-auto w-full">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 bg-[#e5e2d8] w-full rounded-md px-4 py-3 outline-none text-sm placeholder:text-[#1c1c17]/50 focus:ring-2 focus:ring-[#60613c]/30 transition-all"
          />
          <button className="bg-[#8f4900] text-white px-8 py-3 rounded-md font-bold text-sm hover:opacity-90 transition-opacity w-full sm:w-auto">
            Subscribe
          </button>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="w-full bg-[#f1eee5] py-16 px-6 md:px-12 lg:px-20">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 justify-between">
          <div className="sm:col-span-2">
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
                <a href="#" className="hover:text-[#8f4900] transition-colors">
                  Our Craft
                </a>
              </li>
              <li>
                <a href="#" className="text-[#8f4900] font-bold">
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

        <div className="w-full mt-16 text-center text-[11px] text-[#1c1c17]/40 border-t border-[#dbc2b0]/20 pt-8">
          <p>© 2024 Artisanal Flourish Bakery. Hand-kneaded with love.</p>
        </div>
      </footer>
    </div>
  );
}
