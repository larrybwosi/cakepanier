import Image from 'next/image';
import { Noto_Serif, Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import { getCart } from '@repo/lib/dealio/cart';
import { getCatalogProduct } from '@repo/lib/dealio/catalog';
import sanityLoader from '@repo/lib/sanity-loader';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import type { DealioCart, DealioCartItem, DealioProduct } from '@repo/lib/dealio/types';

const notoSerif = Noto_Serif({ subsets: ['latin'], variable: '--font-noto-serif' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta' });

export default async function BoxPage() {
  let cart: DealioCart | null = null;
  let cartItemsWithDetails: Array<
    DealioCartItem & { product: DealioProduct; price: number; subtotal: number }
  > = [];
  let total = 0;

  try {
    cart = await getCart();
    if (cart && cart.items.length > 0) {
      // Fetch details for each product in the cart
      // Note: In a real production app, we'd want a bulk fetch or the cart API would include these details.
      const items = await Promise.all(
        cart.items.map(async (item) => {
          try {
            const product = await getCatalogProduct(item.productId);
            const price = product.variants?.[0]?.price || 0;
            const subtotal = price * item.quantity;
            return {
              ...item,
              product,
              price,
              subtotal,
            };
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}`, err);
            return null;
          }
        })
      );
      cartItemsWithDetails = items.filter((item): item is NonNullable<typeof item> => item !== null);
      total = cartItemsWithDetails.reduce((acc, item) => acc + item.subtotal, 0);
    }
  } catch (error) {
    console.error('Cart fetch failed', error);
    // Likely UNAUTHORIZED or other error
  }

  return (
    <div
      className={`${notoSerif.variable} ${plusJakarta.variable} font-sans bg-[#fdf9f0] text-[#1c1c17] min-h-screen selection:bg-[#e2e2b4] selection:text-[#8f4900]`}
    >
      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/home" className="font-serif text-[#8f4900] text-2xl font-bold tracking-tight">
          Artisanal Flourish
        </Link>
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
          <Link href="/cakes" className="hover:text-[#8f4900] transition-colors">
            Cakes
          </Link>
          <Link href="/findus" className="hover:text-[#8f4900] transition-colors">
            Find Us
          </Link>
        </nav>
        <Link href="/menu">
          <button className="bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#8f4900] to-[#b35e04] text-white px-6 py-2.5 rounded-3xl font-medium text-sm shadow-[0_8px_32px_rgba(28,28,23,0.05)] hover:scale-[1.02] transition-transform">
            Order Now
          </button>
        </Link>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#8f4900]/10 p-3 rounded-2xl text-[#8f4900]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-[#8f4900] text-4xl">Your Box</h1>
            <p className="text-[#1c1c17]/60 text-sm">Your artisanal selection, ready for pickup.</p>
          </div>
        </div>

        {!cart || cartItemsWithDetails.length === 0 ? (
          <div className="mt-12 bg-white/50 border border-[#dbc2b0]/20 p-16 rounded-3xl text-center shadow-sm">
            <div className="max-w-xs mx-auto">
              <div className="bg-[#f1eee5] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#1c1c17]/20">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-[#1c1c17] text-2xl mb-3">Your box is empty</h2>
              <p className="text-[#1c1c17]/60 text-sm mb-8">
                It looks like you haven't added any of our handcrafted treats to your selection yet.
              </p>
              <Link href="/menu">
                <button className="w-full bg-[#8f4900] text-white px-8 py-4 rounded-xl font-bold text-sm shadow-lg shadow-[#8f4900]/10 hover:scale-[1.02] transition-transform">
                  Explore Menu
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItemsWithDetails.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#dbc2b0]/10 flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-[#f1eee5] shrink-0">
                    <Image
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop'}
                      alt={item.product.name}
                      fill
                      loader={sanityLoader}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-serif text-lg text-[#1c1c17] mb-1">{item.product.name}</h3>
                    <p className="text-xs text-[#1c1c17]/50 line-clamp-1 mb-3">{item.product.description}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center bg-[#f1eee5] rounded-lg px-2 py-1">
                        <button className="p-1 hover:text-[#8f4900] transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button className="p-1 hover:text-[#8f4900] transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="text-[#1c1c17]/40 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-[#1c1c17]/50 mb-1">Ksh {item.price} each</p>
                    <p className="font-bold text-[#8f4900]">Ksh {item.subtotal}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-[#f1eee5] p-8 rounded-3xl sticky top-24 border border-[#dbc2b0]/20 shadow-sm">
                <h2 className="font-serif text-[#1c1c17] text-2xl mb-6">Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1c1c17]/60">Subtotal</span>
                    <span className="font-medium text-[#1c1c17]">Ksh {total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1c1c17]/60">Packaging</span>
                    <span className="font-medium text-[#1c1c17]">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1c1c17]/60">Pickup Location</span>
                    <span className="font-medium text-[#1c1c17]">Flagship Oven</span>
                  </div>
                  <div className="h-px bg-[#dbc2b0]/30 my-4" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif text-lg text-[#1c1c17]">Total</span>
                    <span className="font-serif text-2xl font-bold text-[#8f4900]">Ksh {total}</span>
                  </div>
                </div>
                <Button className="w-full bg-[#8f4900] hover:bg-[#7a3e00] text-white py-6 rounded-xl font-bold text-md shadow-lg shadow-[#8f4900]/10 transition-all active:scale-[0.98]">
                  Proceed to Checkout
                </Button>
                <p className="mt-4 text-[10px] text-center text-[#1c1c17]/40 uppercase tracking-widest leading-relaxed">
                  Prices include all taxes. <br />
                  Finalize your order for same-day pickup.
                </p>
              </div>
            </div>
          </div>
        )}
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
          </div>
        </div>
      </footer>
    </div>
  );
}
