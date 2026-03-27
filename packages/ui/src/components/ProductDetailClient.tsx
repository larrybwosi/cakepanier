'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Share2,
  ZoomIn,
} from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { Badge } from '@repo/ui/components/ui/badge';
import { Separator } from '@repo/ui/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useCart } from '@repo/ui/hooks/useCart';
import { useFavorites } from '@repo/ui/hooks/useFavorites';
import type { DealioProduct, DealioVariant } from '@repo/lib/dealio/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import sanityLoader from '@repo/lib/sanity-loader';
import { ShareModal } from './share-modal';
import { ImageLightbox } from './image-view';

interface Props {
  product: DealioProduct;
  inventoryMap: Record<string, { isAvailable: boolean; isLowStock: boolean; totalStock?: number }>;
}

export function ProductDetailClient({ product, inventoryMap }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const [selectedVariant, setSelectedVariant] = useState<DealioVariant | null>(product.variants?.[0] ?? null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleToggleFavorite = async () => {
    if (isFavorite(product.id)) {
      await removeFromFavorites(product.id);
    } else {
      await addToFavorites(product.id);
    }
  };

  // Format images securely
  const images = product.images?.length
    ? product.images.map((url, i) => ({
        url,
        alt: `${product.name} - Image ${i + 1}`,
        isPrimary: i === 0,
      }))
    : [{ url: '/placeholder.svg?height=800&width=800', alt: product.name, isPrimary: true }];

  // Derived inventory status from prefetched map
  const inventoryStatus = (() => {
    if (!selectedVariant) return 'idle';
    const inv = inventoryMap[selectedVariant.id];
    if (!inv || !inv.isAvailable) return 'out';
    if (inv.isLowStock) return 'low';
    return 'ok';
  })();

  useEffect(() => {
    const container = thumbnailRef.current;
    if (!container) return;
    const active = container.children[currentImageIndex] as HTMLElement;
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentImageIndex]);

  const handleAddToCart = async () => {
    if (!selectedVariant || inventoryStatus === 'out') return;
    setIsAdding(true);
    if (navigator.vibrate) navigator.vibrate(50);

    const success = await addToCart(selectedVariant.id, 1);

    if (success) {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }
    setIsAdding(false);
  };

  const nextImage = () => setCurrentImageIndex(prev => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);

  const hasDescription = Boolean(product.description);
  const hasDetails = Boolean(product.detailedDescription);
  const displaySku = selectedVariant?.sku || product.sku;

  return (
    <>
      {showShare && <ShareModal product={product} onClose={() => setShowShare(false)} />}
      {lightboxIndex !== null && (
        <ImageLightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      <div className="min-h-screen bg-background pb-24 lg:pb-0">
        <main className="pt-16 md:pt-24">
          {/* Mobile Header */}
          <div className="fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 md:hidden">
            <div className="container mx-auto px-2 py-2 flex items-center justify-between gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-md">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-semibold text-sm text-foreground truncate flex-1 text-center">{product.name}</h1>
              <Button variant="ghost" size="icon" onClick={() => setShowShare(true)} className="rounded-md">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="h-14 md:hidden" />

          <div className="container mx-auto px-4 py-6 md:py-10 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              {/* Left: Image Gallery */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-32">
                <div className="relative aspect-square sm:aspect-4/3 lg:aspect-square rounded-lg overflow-hidden bg-muted/30 border border-border/40 group">
                  <Image
                    src={images[currentImageIndex].url}
                    alt={images[currentImageIndex].alt ?? product.name}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    fill
                    loader={sanityLoader}
                  />

                  {images.length > 1 && (
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
                  )}

                  {/* Desktop Image Controls */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/95 hover:bg-background text-foreground rounded-md shadow-lg backdrop-blur-md transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/95 hover:bg-background text-foreground rounded-md shadow-lg backdrop-blur-md transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                    {product.isFeatured && (
                      <Badge className="bg-primary text-primary-foreground shadow-md font-semibold px-3 py-1 rounded-sm">
                        ★ Featured
                      </Badge>
                    )}
                    {inventoryStatus === 'low' && (
                      <Badge
                        variant="outline"
                        className="bg-amber-100/90 dark:bg-amber-900/40 border-amber-500/30 text-amber-800 dark:text-amber-200 backdrop-blur-md px-3 py-1 rounded-sm"
                      >
                        Low Stock
                      </Badge>
                    )}
                  </div>

                  {/* Zoom Button */}
                  <button
                    onClick={() => setLightboxIndex(currentImageIndex)}
                    className="absolute bottom-4 right-4 h-10 w-10 bg-background/95 hover:bg-background rounded-md shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div
                    ref={thumbnailRef}
                    className="flex gap-3 overflow-x-auto pb-2 scroll-smooth py-1"
                    style={{ scrollbarWidth: 'none' }}
                  >
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-20 h-20 shrink-0 rounded-md overflow-hidden transition-all duration-200 focus:outline-none ring-offset-2 ring-offset-background ${
                          currentImageIndex === idx
                            ? 'ring-2 ring-primary shadow-sm'
                            : 'opacity-60 hover:opacity-100 hover:ring-2 hover:ring-border/80'
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt ?? ''}
                          loader={sanityLoader}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Details */}
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium rounded-sm px-2.5 bg-muted/60 text-muted-foreground hover:bg-muted/80"
                      >
                        {product.category?.name ?? 'Uncategorized'}
                      </Badge>
                      <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight">
                        {product.name}
                      </h1>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 mt-1">
                      <button
                        onClick={handleToggleFavorite}
                        className={`p-2.5 rounded-md transition-all duration-200 ${
                          isFavorite(product.id)
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 transition-transform ${isFavorite(product.id) ? 'fill-rose-500 scale-110' : 'scale-100'}`}
                        />
                      </button>
                      <button
                        onClick={() => setShowShare(true)}
                        className="p-2.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {selectedVariant && (
                    <div className="mt-4 flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-foreground tracking-tight">
                        Ksh {selectedVariant.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="opacity-60" />

                {hasDescription && (
                  <p className="text-muted-foreground text-base leading-relaxed">{product.description}</p>
                )}

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Select Option</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.map(variant => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={!variant.isAvailable}
                          className={`relative px-5 py-3 rounded-md border text-sm transition-all duration-200 min-w-25 text-center focus:outline-none focus:ring-2 focus:ring-primary/40 ring-offset-1 ${
                            selectedVariant?.id === variant.id
                              ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary'
                              : !variant.isAvailable
                                ? 'border-border/40 bg-muted/20 text-muted-foreground/40 cursor-not-allowed'
                                : 'border-border/60 bg-background text-foreground hover:border-primary/40 hover:bg-muted/30'
                          }`}
                        >
                          <span className="block font-medium">{variant.name}</span>
                          <span
                            className={`block text-xs mt-1 ${selectedVariant?.id === variant.id ? 'text-primary/80' : 'text-muted-foreground'}`}
                          >
                            Ksh {variant.price.toLocaleString()}
                          </span>
                          {!variant.isAvailable && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="w-[120%] h-px bg-border rotate-12" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Status & Action (Desktop Only Actions) */}
                <div className="space-y-6">
                  <div className="min-h-6 flex items-center">
                    {inventoryStatus === 'low' && selectedVariant && (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-sm w-fit">
                        <AlertCircle className="h-4 w-4" />
                        Only {inventoryMap[selectedVariant.id]?.totalStock || selectedVariant.totalStock} left — order
                        soon
                      </div>
                    )}
                    {inventoryStatus === 'out' && (
                      <div className="flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 px-3 py-1.5 rounded-sm w-fit">
                        <AlertCircle className="h-4 w-4" />
                        Out of stock for this option
                      </div>
                    )}
                    {inventoryStatus === 'ok' && (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-sm w-fit">
                        <CheckCircle className="h-4 w-4" />
                        In stock & ready to ship
                      </div>
                    )}
                  </div>

                  {/* Desktop Checkout Button */}
                  <div className="hidden lg:flex gap-3">
                    <Button
                      size="lg"
                      className={`flex-1 h-14 rounded-md text-base font-semibold shadow-md transition-all duration-300 ${
                        addedSuccess ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
                      }`}
                      disabled={isAdding || inventoryStatus === 'out' || !selectedVariant}
                      onClick={handleAddToCart}
                    >
                      {addedSuccess ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" /> Added to Cart
                        </>
                      ) : isAdding ? (
                        <>
                          <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />{' '}
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
                        </>
                      )}
                    </Button>
                  </div>

                  {displaySku && (
                    <div className="flex items-center gap-2 text-muted-foreground/60 text-xs font-mono">
                      <Clock className="h-3.5 w-3.5" /> SKU: {displaySku}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Details (Markdown) */}
            {hasDetails && product.detailedDescription && (
              <div className="mt-16 md:mt-24">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Product Details</h2>
                  <div className="flex-1 h-px bg-border/60" />
                </div>

                <div className="text-base leading-relaxed text-muted-foreground max-w-4xl">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Custom Typography
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold mt-10 mb-6 text-foreground tracking-tight">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold mt-10 mb-5 text-foreground tracking-tight border-b border-border/40 pb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-medium mt-8 mb-4 text-foreground tracking-tight">{children}</h3>
                      ),
                      p: ({ children }) => <p className="mb-6 leading-relaxed text-muted-foreground">{children}</p>,
                      a: ({ children, href }) => (
                        <a
                          href={href}
                          className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors font-medium"
                        >
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,

                      // Custom Lists
                      ul: ({ children }) => (
                        <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted-foreground">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-muted-foreground">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => <li className="pl-1 leading-relaxed">{children}</li>,

                      // Custom Blocks
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-primary pl-6 py-1 my-6 italic bg-muted/30 rounded-r-lg text-foreground/80">
                          {children}
                        </blockquote>
                      ),
                      code: ({ className, children }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return match ? (
                          <div className="my-6 rounded-lg overflow-hidden border border-border/50 bg-[#1e1e1e]">
                            <div className="flex items-center px-4 py-2 bg-muted/20 border-b border-border/10 text-xs text-muted-foreground font-mono uppercase tracking-wider">
                              {match[1]}
                            </div>
                            <pre className="p-4 overflow-x-auto text-sm text-gray-300">
                              <code className={className}>{children}</code>
                            </pre>
                          </div>
                        ) : (
                          <code className="bg-muted px-1.5 py-0.5 rounded-md text-[0.875em] font-mono border border-border/40 text-foreground">
                            {children}
                          </code>
                        );
                      },

                      // Enterprise Grade Tables
                      table: ({ children }) => (
                        <div className="w-full overflow-x-auto my-8 rounded-lg border border-border/60 shadow-sm bg-background">
                          <table className="w-full text-left text-sm whitespace-nowrap">{children}</table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-muted/50 border-b border-border/60">{children}</thead>
                      ),
                      tbody: ({ children }) => <tbody className="divide-y divide-border/60">{children}</tbody>,
                      tr: ({ children }) => <tr className="hover:bg-muted/20 transition-colors">{children}</tr>,
                      th: ({ children }) => (
                        <th className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">{children}</th>
                      ),
                      td: ({ children }) => <td className="px-6 py-4 text-muted-foreground">{children}</td>,

                      // Images inside markdown
                      img: ({ src, alt }) => (
                        <span className="block my-8 rounded-xl overflow-hidden border border-border/40 shadow-sm">
                          <img
                            src={src}
                            alt={alt}
                            className="w-full h-auto object-cover max-h-[600px]"
                            loading="lazy"
                          />
                        </span>
                      ),
                    }}
                  >
                    {product.detailedDescription}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/50 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom-full">
        <div className="container mx-auto max-w-md flex items-center gap-4">
          <div className="flex-1 flex flex-col">
            <span className="text-sm font-semibold text-foreground">Ksh {selectedVariant?.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground font-medium truncate">
              {inventoryStatus === 'out' ? 'Out of stock' : selectedVariant?.name}
            </span>
          </div>
          <Button
            size="lg"
            className={`h-12 px-8 rounded-md font-semibold shadow-md transition-all duration-300 ${
              addedSuccess ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
            }`}
            disabled={isAdding || inventoryStatus === 'out' || !selectedVariant}
            onClick={handleAddToCart}
          >
            {addedSuccess ? (
              <CheckCircle className="h-5 w-5" />
            ) : isAdding ? (
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              'Add to Cart'
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
