// components/share-modal.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Link2, QrCode, Copy, Check, Twitter, Facebook, MessageCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { DealioProduct } from '@/lib/dealio/types';

interface ShareModalProps {
  product: DealioProduct;
  onClose: () => void;
}

export function ShareModal({ product, onClose }: ShareModalProps) {
  const [tab, setTab] = useState<'link' | 'qr'>('link');
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

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
    if (tab === 'qr') generateQR();
  }, [tab, generateQR]);

  const downloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${product.name.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
    a.click();
  };

  const socials = [
    {
      label: 'Twitter / X',
      icon: Twitter,
      color: 'hover:bg-black hover:text-white',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name}`)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: 'Facebook',
      icon: Facebook,
      color: 'hover:bg-[#1877F2] hover:text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'hover:bg-[#25D366] hover:text-white',
      url: `https://wa.me/?text=${encodeURIComponent(`${product.name} - ${shareUrl}`)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-background border border-border/60 rounded-t-md sm:rounded-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Share Product</h2>
            <p className="text-sm text-muted-foreground mt-0.5 truncate max-w-[240px]">{product.name}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex px-6 gap-1 mb-4">
          {(['link', 'qr'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {t === 'link' ? <Link2 className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
              {t === 'link' ? 'Shareable Link' : 'QR Code'}
            </button>
          ))}
        </div>

        <Separator />

        <div className="p-6 space-y-5">
          {tab === 'link' ? (
            <>
              <div className="flex items-center gap-2 bg-muted/50 rounded-sm px-4 py-3 border border-border/40">
                <span className="text-sm text-muted-foreground truncate flex-1 font-mono">{shareUrl}</span>
                <button
                  onClick={copyLink}
                  className="shrink-0 p-2 rounded-sm hover:bg-background border border-transparent hover:border-border/50 transition-all shadow-sm"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-foreground" />}
                </button>
              </div>

              <Button
                className="w-full h-11 text-sm font-medium rounded-sm"
                variant={copied ? 'secondary' : 'default'}
                onClick={copyLink}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" /> Copy Link
                  </>
                )}
              </Button>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Share on</p>
                <div className="grid grid-cols-3 gap-3">
                  {socials.map(s => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-2 py-3 px-2 rounded-sm border border-border/50 text-sm font-medium transition-all ${s.color} hover:border-transparent hover:shadow-md`}
                    >
                      <s.icon className="h-5 w-5" />
                      <span className="text-xs">{s.label.split(' ')[0]}</span>
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="w-52 h-52 bg-white rounded-md flex items-center justify-center border border-border shadow-sm overflow-hidden p-2">
                  {qrLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                  ) : qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
                  ) : null}
                </div>
                <p className="text-sm text-center text-muted-foreground max-w-50">
                  Scan to view this product on any device
                </p>
              </div>

              <Button className="w-full h-11 rounded-sm" onClick={downloadQR} disabled={!qrDataUrl}>
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
