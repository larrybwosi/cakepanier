'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, Trash2, Gift, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface InventoryIssue {
  variantId: string;
  message: string;
}

const Page = () => {
  const { items, loading, loyaltyPoints, updateQuantity, removeItem, getCartTotal, getItemCount, clearCart } = useCart();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [inventoryIssues, setInventoryIssues] = useState<InventoryIssue[]>([]);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Validate inventory for all cart items
  const validateInventory = async (): Promise<boolean> => {
    const variantIds = items.map(i => i.variantId).filter(Boolean);
    if (!variantIds.length) return true;

    try {
      const res = await fetch('/api/dealio/inventory/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantIds }),
      });
      const json = await res.json();
      const inventoryData: Array<{ variantId: string; isAvailable: boolean; availableStock: number }> =
        json.data ?? [];

      const issues: InventoryIssue[] = [];
      for (const item of items) {
        const inv = inventoryData.find(d => d.variantId === item.variantId);
        if (!inv || !inv.isAvailable) {
          issues.push({
            variantId: item.variantId,
            message: `"${item.productName}${item.variantName ? ` (${item.variantName})` : ''}" is out of stock.`,
          });
        } else if (inv.availableStock < item.quantity) {
          issues.push({
            variantId: item.variantId,
            message: `"${item.productName}" only has ${inv.availableStock} units available (you have ${item.quantity}).`,
          });
        }
      }

      setInventoryIssues(issues);
      return issues.length === 0;
    } catch {
      // Fail open — proceed to Dealio which will return INSUFFICIENT_INVENTORY on submit
      return true;
    }
  };

  const handleCheckout = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: 'Please sign in', description: 'Sign in to place an order.', variant: 'destructive' });
      return;
    }

    setIsCheckingOut(true);
    setInventoryIssues([]);

    // Step 1 — inventory check
    const inventoryOk = await validateInventory();
    if (!inventoryOk) {
      setIsCheckingOut(false);
      toast({ title: 'Stock issue', description: 'Some items are unavailable. Please review your cart.', variant: 'destructive' });
      return;
    }

    try {
      // Step 2 — create Supabase order record
      const orderNumber = `ORD-${Date.now()}`;
      const subtotal = getCartTotal();

      const { data: orderRecord, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          order_number: orderNumber,
          status: 'pending',
          total_amount: subtotal,
          items: items as unknown as any,
        })
        .select('id')
        .single();

      if (orderErr || !orderRecord) throw orderErr ?? new Error('Failed to create order');

      // Step 3 — get customer's Dealio ID if synced
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('dealio_customer_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      const dealioCustomerId = (profile as any)?.dealio_customer_id ?? undefined;

      // Step 4 — submit to Dealio
      const dealioRes = await fetch('/api/dealio/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseOrderId: orderRecord.id,
          customerId: dealioCustomerId,
          items: items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.variantPrice,
          })),
        }),
      });

      const dealioJson = await dealioRes.json();

      if (!dealioRes.ok) {
        if (dealioRes.status === 409) {
          // Inventory issue from Dealio
          toast({
            title: 'Stock unavailable',
            description: dealioJson.message ?? 'Some items are no longer available.',
            variant: 'destructive',
          });
          setIsCheckingOut(false);
          return;
        }
        throw new Error(dealioJson.message ?? 'Order submission failed');
      }

      // Step 5 — award flat loyalty points (1 point per Ksh spent)
      const earnedPoints = Math.floor(subtotal);
      await supabase.from('user_loyalty_points').upsert(
        {
          user_id: session.user.id,
          points_earned: earnedPoints,
          total_points: loyaltyPoints + earnedPoints,
        },
        { onConflict: 'user_id' },
      );

      // Step 6 — clear cart
      await clearCart();

      setOrderSuccess(dealioJson.data?.orderNumber ?? orderNumber);
      toast({ title: 'Order placed!', description: `Your order ${dealioJson.data?.orderNumber} has been confirmed.` });
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast({ title: 'Checkout failed', description: err.message ?? 'Please try again.', variant: 'destructive' });
    } finally {
      setIsCheckingOut(false);
    }
  };

  // ── Order success screen ──────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen">
        <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <Header />
        </div>
        <main className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center py-16 space-y-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h1 className="text-3xl font-display font-bold text-foreground">Order Confirmed!</h1>
              <p className="text-muted-foreground">
                Order <span className="font-semibold text-foreground">{orderSuccess}</span> has been placed and is being prepared.
              </p>
              <Button asChild size="lg" variant="hero">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen">
        <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <Header />
        </div>
        <main className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
          <Header />
        </div>
        <main className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center py-12">
              <h1 className="text-3xl font-display font-bold text-foreground mb-4">Your Cart is Empty</h1>
              <p className="text-muted-foreground mb-8">Add some delicious items from our menu to get started.</p>
              <Button asChild size="lg" variant="hero">
                <Link href="/products">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = getCartTotal();
  const earnedPoints = Math.floor(subtotal);

  return (
    <div className="min-h-screen">
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <Header />
      </div>

      <main className="pt-20 pb-8">
        {/* Mobile header */}
        <div className={`sticky z-40 bg-background/95 backdrop-blur-xs border-b border-border md:hidden transition-all duration-300 ${isHeaderVisible ? 'top-16' : 'top-0'}`}>
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild className="p-2 -ml-2">
              <Link href="/products"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <h1 className="font-display font-semibold text-lg text-foreground">
              Cart ({getItemCount()})
            </h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Desktop header */}
            <div className="hidden md:block mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <h1 className="text-3xl font-display font-bold text-foreground">
                Shopping Cart ({getItemCount()} items)
              </h1>
            </div>

            {/* Inventory issues banner */}
            {inventoryIssues.length > 0 && (
              <div className="mb-6 p-4 rounded-lg border border-destructive/50 bg-destructive/10 space-y-1">
                {inventoryIssues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{issue.message}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map(item => {
                  const hasIssue = inventoryIssues.some(i => i.variantId === item.variantId);
                  const itemTotal = item.variantPrice * item.quantity;

                  return (
                    <Card key={`${item.productId}-${item.variantId}`} className={hasIssue ? 'border-destructive/50' : ''}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-display font-semibold text-foreground text-lg">
                                  {item.productName}
                                </h3>
                                {item.variantName && (
                                  <p className="text-muted-foreground text-sm">{item.variantName}</p>
                                )}
                                {hasIssue && (
                                  <Badge variant="destructive" className="text-xs mt-1">
                                    Unavailable
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => item.id && removeItem(item.id)}
                                className="text-muted-foreground hover:text-destructive shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {item.addOns.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm text-muted-foreground mb-1">Add-ons:</p>
                                <div className="flex flex-wrap gap-1">
                                  {item.addOns.map((addon, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {addon.name} (+Ksh {addon.price.toFixed(2)})
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => item.id && updateQuantity(item.id, item.quantity - 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="font-medium text-foreground min-w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => item.id && updateQuantity(item.id, item.quantity + 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-foreground">
                                  Ksh {itemTotal.toLocaleString()}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Ksh {item.variantPrice.toLocaleString()} each
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className={`sticky transition-all duration-300 ${isHeaderVisible ? 'top-32' : 'top-16'}`}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-display">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">Ksh {subtotal.toLocaleString()}</span>
                      </div>

                      <Separator />

                      {/* Loyalty Points */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-secondary" />
                          <span className="font-medium text-foreground">Loyalty Points</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Current Balance</span>
                          <span className="font-medium text-secondary">{loyaltyPoints} pts</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Will Earn</span>
                          <span className="font-medium text-secondary">+{earnedPoints} pts</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-foreground">New Balance</span>
                          <span className="text-secondary">{loyaltyPoints + earnedPoints} pts</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>Ksh {subtotal.toLocaleString()}</span>
                      </div>

                      <Button
                        size="lg"
                        variant="hero"
                        className="w-full"
                        onClick={handleCheckout}
                        disabled={isCheckingOut || inventoryIssues.length > 0}
                      >
                        {isCheckingOut ? 'Placing Order...' : 'Proceed to Checkout'}
                      </Button>

                      <Button variant="outline" size="lg" asChild className="w-full">
                        <Link href="/products">Continue Shopping</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Page;
