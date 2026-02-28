"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  Link2,
  QrCode,
  X,
  Copy,
  Check,
  Twitter,
  Facebook,
  MessageCircle,
  Download,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import type { DealioProduct, DealioVariant } from "@/lib/dealio/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import sanityLoader from '@/lib/sanity-loader'

interface Props {
  product: DealioProduct;
}

// ─── Share Modal ─────────────────────────────────────────────────────────────

function ShareModal({
  product,
  onClose,
}: {
  product: DealioProduct;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"link" | "qr">("link");
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQR = useCallback(async () => {
    if (qrDataUrl || qrLoading) return;
    setQrLoading(true);
    try {
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}&format=png&margin=10`;
      setQrDataUrl(apiUrl);
    } finally {
      setQrLoading(false);
    }
  }, [shareUrl, qrDataUrl, qrLoading]);

  useEffect(() => {
    if (tab === "qr") generateQR();
  }, [tab, generateQR]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `${product.name.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    a.click();
  };

  const socials = [
    {
      label: "Twitter / X",
      icon: Twitter,
      color: "hover:bg-black hover:text-white",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name}`)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "Facebook",
      icon: Facebook,
      color: "hover:bg-[#1877F2] hover:text-white",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-[#25D366] hover:text-white",
      url: `https://wa.me/?text=${encodeURIComponent(`${product.name} - ${shareUrl}`)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-md bg-background border border-border/60 rounded-lg sm:rounded-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Share Product
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-[240px]">
              {product.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex px-6 gap-1 mb-4">
          {(["link", "qr"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t === "link" ? (
                <Link2 className="h-4 w-4" />
              ) : (
                <QrCode className="h-4 w-4" />
              )}
              {t === "link" ? "Shareable Link" : "QR Code"}
            </button>
          ))}
        </div>

        <Separator />

        <div className="p-6 space-y-5">
          {tab === "link" ? (
            <>
              <div className="flex items-center gap-2 bg-muted rounded-md px-4 py-3 border border-border/40">
                <span className="text-sm text-muted-foreground truncate flex-1 font-mono">
                  {shareUrl}
                </span>
                <button
                  onClick={copyLink}
                  className="shrink-0 p-1.5 rounded-md hover:bg-background transition-colors"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button
                className="w-full"
                variant={copied ? "outline" : "default"}
                onClick={copyLink}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
                  Share on
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-md border border-border/50 text-sm font-medium transition-all ${s.color}`}
                    >
                      <s.icon className="h-5 w-5" />
                      <span className="text-xs">{s.label.split(" ")[0]}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="w-52 h-52 bg-white rounded-md flex items-center justify-center border border-border/30 shadow-inner overflow-hidden">
                  {qrLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                  ) : qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : null}
                </div>
                <p className="text-sm text-center text-muted-foreground max-w-[200px]">
                  Scan to view this product on any device
                </p>
              </div>

              <Button
                className="w-full"
                onClick={downloadQR}
                disabled={!qrDataUrl}
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Image Lightbox ───────────────────────────────────────────────────────────

function ImageLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: { url: string; alt?: string | null }[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((p) => (p + 1) % images.length);
      if (e.key === "ArrowLeft")
        setIdx((p) => (p - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative w-full h-full max-w-7xl max-h-[90vh] px-4 md:px-16">
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setIdx((p) => (p - 1 + images.length) % images.length)
              }
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={() => setIdx((p) => (p + 1) % images.length)}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}

        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={images[idx].url}
            alt={images[idx].alt ?? "Product image"}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 90vw"
            priority
            loader={sanityLoader}
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`transition-all ${
                i === idx
                  ? "w-6 h-2 bg-white rounded-md"
                  : "w-2 h-2 bg-white/40 rounded-md hover:bg-white/60"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      <p className="absolute bottom-6 right-6 text-white/60 text-sm bg-black/20 px-3 py-1 rounded-md">
        {idx + 1} / {images.length}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductDetailClient({ product }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const [selectedVariant, setSelectedVariant] = useState<DealioVariant | null>(
    product.variants?.[0] ?? null,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [inventoryStatus, setInventoryStatus] = useState<
    "idle" | "checking" | "ok" | "low" | "out"
  >("idle");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Format images securely
  const images = product.images?.length
    ? product.images
    : product.imageUrls?.length
      ? product.imageUrls.map((url, i) => ({
          url,
          alt: `${product.name} - Image ${i + 1}`,
          isPrimary: i === 0,
        }))
      : [
          {
            url: "/placeholder.svg?height=800&width=800",
            alt: product.name,
            isPrimary: true,
          },
        ];

  useEffect(() => {
    if (!selectedVariant) return;
    setInventoryStatus("checking");
    fetch("/api/dealio/inventory/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: selectedVariant.id }),
    })
      .then((r) => r.json())
      .then((res) => {
        const inv = res.data;
        if (!inv || !inv.isAvailable) setInventoryStatus("out");
        else if (inv.isLowStock) setInventoryStatus("low");
        else setInventoryStatus("ok");
      })
      .catch(() => setInventoryStatus("idle"));
  }, [selectedVariant?.id]);

  useEffect(() => {
    const container = thumbnailRef.current;
    if (!container) return;
    const active = container.children[currentImageIndex] as HTMLElement;
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentImageIndex]);

  const handleAddToCart = async () => {
    if (!selectedVariant || inventoryStatus === "out") return;
    setIsAdding(true);
    if (navigator.vibrate) navigator.vibrate(50);

    const success = await addToCart({
      productId: product.id,
      productName: product.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      variantPrice: selectedVariant.price,
      addOns: [],
      productImage: images.find((i) => i.isPrimary)?.url ?? images[0]?.url,
    });

    if (success) {
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }
    setIsAdding(false);
  };

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const hasDescription = Boolean(product.description);
  const hasDetails = Boolean(product.detailedDescription);
  const displaySku = selectedVariant?.sku || product.sku;

  return (
    <>
      {showShare && (
        <ShareModal product={product} onClose={() => setShowShare(false)} />
      )}

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <div className="min-h-screen bg-background">
        <main className="pt-16 md:pt-20">
          {/* Desktop breadcrumb */}
          <div className="border-b border-border/30 hidden md:block">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/products")}
                className="text-muted-foreground hover:text-foreground gap-1.5 -ml-2 h-8 text-xs font-medium"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>

              <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="hover:text-foreground cursor-pointer transition-colors"
                  onClick={() => router.push("/")}
                >
                  Home
                </span>
                <span className="text-border">/</span>
                <span
                  className="hover:text-foreground cursor-pointer transition-colors"
                  onClick={() => router.push("/products")}
                >
                  Products
                </span>
                {product.category?.name && (
                  <>
                    <span className="text-border">/</span>
                    <span className="hover:text-foreground cursor-pointer transition-colors">
                      {product.category.name}
                    </span>
                  </>
                )}
                <span className="text-border">/</span>
                <span className="text-foreground font-medium truncate max-w-[200px]">
                  {product.name}
                </span>
              </nav>

              <div className="w-16" />
            </div>
          </div>

          {/* Mobile header */}
          <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/40 md:hidden">
            <div className="container mx-auto px-3 py-3 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/products")}
                className="p-2 -ml-1 min-h-11 min-w-11 rounded-md"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-semibold text-base text-foreground truncate flex-1 text-center">
                {product.name}
              </h1>
              <button
                onClick={() => setShowShare(true)}
                className="p-2 rounded-md hover:bg-muted transition-colors min-h-11 min-w-11 flex items-center justify-center"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="h-14 md:hidden" />

          <div className="container mx-auto px-4 py-8 md:py-10 pb-32 md:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
              {/* Left: Image Gallery */}
              <div className="flex flex-col gap-4 lg:sticky lg:top-24">
                {/* Main Image */}
                <div className="relative aspect-square rounded-md overflow-hidden bg-muted/50 border border-border/30 shadow-md group">
                  <Image
                    src={images[currentImageIndex].url}
                    alt={images[currentImageIndex].alt ?? product.name}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    fill
                    loader={sanityLoader}
                  />

                  {images.length > 1 && (
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-background/90 hover:bg-background text-foreground rounded-md shadow-md backdrop-blur-sm transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 bg-background/90 hover:bg-background text-foreground rounded-md shadow-md backdrop-blur-sm transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
                      {images.map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-md transition-all duration-300 ${
                            i === currentImageIndex
                              ? "w-6 h-1.5 bg-white"
                              : "w-1.5 h-1.5 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                    {product.isFeatured && (
                      <Badge className="bg-primary text-primary-foreground shadow-md text-xs font-semibold tracking-wide rounded-md">
                        ★ Featured
                      </Badge>
                    )}
                    {inventoryStatus === "low" && (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs rounded-md"
                      >
                        Low Stock
                      </Badge>
                    )}
                  </div>

                  <button
                    onClick={() => setLightboxIndex(currentImageIndex)}
                    className="absolute bottom-4 right-4 h-9 w-9 bg-background/90 hover:bg-background rounded-md shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div
                    ref={thumbnailRef}
                    className="flex gap-2 overflow-x-auto pb-1 scroll-smooth"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          currentImageIndex === idx
                            ? "border-primary shadow-sm"
                            : "border-transparent opacity-60 hover:opacity-100 hover:border-border/60"
                        }`}
                        aria-label={`View image ${idx + 1}`}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt ?? `${product.name} ${idx + 1}`}
                          loader={sanityLoader}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {product.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs rounded-md px-3 py-1"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Product Details */}
              <div className="flex flex-col gap-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <Badge
                        variant="outline"
                        className="text-xs font-medium rounded-md px-3"
                      >
                        {product.category?.name ?? "Uncategorized"}
                      </Badge>
                      <h1 className="text-2xl md:text-3xl font-semibold text-foreground leading-tight tracking-tight">
                        {product.name}
                      </h1>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 mt-1">
                      <button
                        onClick={() => setIsWishlisted((p) => !p)}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          isWishlisted
                            ? "bg-rose-50 dark:bg-rose-950/30 text-rose-500"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart
                          className={`h-5 w-5 transition-all ${isWishlisted ? "fill-rose-500" : ""}`}
                        />
                      </button>
                      <button
                        onClick={() => setShowShare(true)}
                        className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
                        aria-label="Share"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {selectedVariant && (
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-semibold text-foreground">
                        Ksh {selectedVariant.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="opacity-50" />

                {hasDescription && (
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {product.description}
                  </p>
                )}

                <Separator className="opacity-50" />

                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground">
                        Select Option
                      </h3>
                      {selectedVariant && (
                        <span className="text-sm text-muted-foreground">
                          {selectedVariant.name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          disabled={!variant.isAvailable}
                          className={`relative px-4 py-2.5 rounded-md border text-sm font-medium transition-all duration-200 min-w-[90px] text-center focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                            selectedVariant?.id === variant.id
                              ? "border-primary bg-primary/5 text-foreground"
                              : !variant.isAvailable
                                ? "border-border/40 bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
                                : "border-border/60 bg-background text-foreground hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <span className="block">{variant.name}</span>
                          <span className="block text-xs text-muted-foreground mt-0.5 font-normal">
                            Ksh {variant.price.toLocaleString()}
                          </span>
                          {!variant.isAvailable && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-full h-px bg-muted-foreground/30 rotate-12" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="min-h-[28px]">
                  {inventoryStatus === "checking" && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/40 border-t-muted-foreground animate-spin" />
                      Checking availability…
                    </div>
                  )}
                  {inventoryStatus === "low" && (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span className="font-medium">
                        Only {selectedVariant?.totalStock} left — order soon
                      </span>
                    </div>
                  )}
                  {inventoryStatus === "out" && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span className="font-medium">
                        Out of stock for this option
                      </span>
                    </div>
                  )}
                  {inventoryStatus === "ok" && (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span className="font-medium">
                        In stock & ready to ship
                      </span>
                    </div>
                  )}
                </div>

                {displaySku && (
                  <div className="flex items-center gap-2 text-muted-foreground/60 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>SKU: {displaySku}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    size="lg"
                    className={`flex-1 h-12 rounded-md text-base font-medium transition-all duration-300 ${
                      addedSuccess ? "bg-emerald-600 hover:bg-emerald-700" : ""
                    }`}
                    disabled={
                      isAdding || inventoryStatus === "out" || !selectedVariant
                    }
                    onClick={handleAddToCart}
                  >
                    {addedSuccess ? (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Added to Cart
                      </>
                    ) : isAdding ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin mr-2" />
                        Adding…
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                        {selectedVariant && (
                          <span className="ml-2 opacity-75 font-normal text-sm">
                            · Ksh {selectedVariant.price.toLocaleString()}
                          </span>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Details (Markdown) */}
            {hasDetails && product.detailedDescription && (
              <div className="mt-12 md:mt-16">
                <Separator className="mb-8 opacity-40" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-1 bg-primary rounded-full" />
                    <h2 className="text-lg font-semibold text-foreground tracking-tight">
                      Product Details
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-border/40" />
                </div>

                <div
                  className="prose prose-sm md:prose-base dark:prose-invert max-w-none
                  prose-headings:font-semibold prose-headings:text-foreground prose-headings:tracking-tight
                  prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                  prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-2 prose-h2:mt-8
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-sm
                  prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-li:text-muted-foreground prose-li:text-sm prose-li:leading-relaxed
                  prose-ul:my-4 prose-ol:my-4
                  prose-code:bg-muted prose-code:border prose-code:border-border/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-code:text-foreground prose-code:font-mono
                  prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-pre:rounded-md
                  prose-blockquote:border-l-primary/60 prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-md prose-blockquote:py-1 prose-blockquote:text-muted-foreground prose-blockquote:not-italic
                  prose-table:text-sm prose-thead:bg-muted/50 prose-th:text-foreground prose-th:font-semibold prose-td:text-muted-foreground
                  prose-img:rounded-md prose-img:border prose-img:border-border/30 prose-img:shadow-sm
                  prose-hr:border-border/30"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {product.detailedDescription}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
