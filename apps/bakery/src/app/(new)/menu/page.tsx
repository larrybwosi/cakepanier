import Image from 'next/image';
import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import { getCatalogCategories, getCatalogProducts } from '@repo/lib/dealio/catalog';
import sanityLoader from '@repo/lib/sanity-loader';

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export default async function Menu() {
  const [categories, productsResponse] = await Promise.all([
    getCatalogCategories().catch(() => []),
    getCatalogProducts({ limit: 100 }).catch(() => ({ products: [] })),
  ]);

  const products = productsResponse.products || [];

  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    const categoryProducts = products.filter(p => p.categoryId === category.id);
    if (categoryProducts.length > 0) {
      acc.push({
        ...category,
        products: categoryProducts,
      });
    }
    return acc;
  }, [] as any[]);

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
          <Link href="/menu" className="text-[#8f4900] border-b-2 border-[#8f4900] pb-1">
            Menu
          </Link>
          <Link href="/our-craft" className="hover:text-[#8f4900] transition-colors">
            Our Craft
          </Link>
          <Link href="/cakes" className="hover:text-[#8f4900] transition-colors">
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

      <main>
        {/* HERO SECTION */}
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
          <h1 className="font-serif text-[#8f4900] text-5xl md:text-7xl mb-6">Our Daily Bake</h1>
          <p className="text-lg md:text-xl text-[#1c1c17]/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Hand-kneaded, long-fermented, and baked in stone hearths. Every item on our menu is a testament to the slow
            craft of traditional baking.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <a
                key={category.id}
                href={`#category-${category.id}`}
                className="bg-[#f1eee5] px-5 py-2 rounded-full text-sm font-medium hover:bg-[#e2e2b4] transition-colors"
              >
                {category.name}
              </a>
            ))}
          </div>
        </section>

        {/* MENU CATEGORIES */}
        {productsByCategory.map((category, idx) => (
          <section key={category.id} id={`category-${category.id}`} className={idx % 2 === 0 ? "bg-white py-24" : "max-w-7xl mx-auto px-6 py-24"}>
            <div className={idx % 2 === 0 ? "max-w-7xl mx-auto px-6" : ""}>
               <h2 className="font-serif text-[#8f4900] text-4xl mb-12">{category.name}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                 {category.products.map((product: any) => (
                   <Link key={product.id} href={`/product/${product.id}`} className="group cursor-pointer">
                      <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(28,28,23,0.03)] mb-4">
                        <Image
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop'}
                          alt={product.name}
                          fill
                          loader={sanityLoader}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-serif text-[#8f4900] text-lg">{product.name}</h4>
                        <span className="font-medium text-[#8f4900]">
                          {product.variants?.[0]?.price ? `Ksh ${product.variants[0].price}` : 'N/A'}
                        </span>
                      </div>
                      <p className="text-xs text-[#1c1c17]/60 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                   </Link>
                 ))}
               </div>
            </div>
          </section>
        ))}

        {/* BOTTOM SECTION: Newsletter */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-2xl mx-auto">
              <div className="bg-[#f1eee5] rounded-3xl p-8 text-center">
                <h4 className="font-serif text-[#8f4900] text-2xl mb-2">Join our Bakers Club</h4>
                <p className="text-sm text-[#1c1c17]/70 mb-6">
                  Get notified when fresh batches leave the oven and receive exclusive weekend specials.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 bg-[#ffffff] rounded-xl px-4 py-3 border border-[#dbc2b0] border-opacity-15 focus:border-[#60613c] focus:border-opacity-40 focus:ring-0 outline-none text-sm placeholder:text-[#1c1c17]/40 transition-colors"
                  />
                  <button className="bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#8f4900] to-[#b35e04] text-white px-8 py-3 rounded-3xl font-medium text-sm shadow-[0_8px_32px_rgba(28,28,23,0.05)] hover:scale-[1.02] transition-transform">
                    Join
                  </button>
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
