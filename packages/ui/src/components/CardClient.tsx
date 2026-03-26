"use client";

import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Minus,
    Plus,
    Trash2,
    Gift,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import Header from "@repo/ui/components/Header";
import { useCart } from "@repo/ui/hooks/useCart";
import { useToast } from "@repo/ui/hooks/use-toast";
import Link from "next/link";
import { checkout } from "@repo/lib/dealio/cart";

interface InventoryIssue {
    variantId: string;
    message: string;
}

const CartClient = ({ user }: { user: any }) => {
    const {
        items,
        loading,
        loyaltyPoints,
        updateQuantity,
        removeItem,
        getCartTotal,
        getItemCount,
        clearCart,
    } = useCart();
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [inventoryIssues, setInventoryIssues] = useState<InventoryIssue[]>(
        [],
    );
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
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Validate inventory for all cart items
    const validateInventory = async (): Promise<boolean> => {
        const variantIds = items.map((i) => i.variantId).filter(Boolean);
        if (!variantIds.length) return true;

        try {
            const res = await fetch("/api/dealio/inventory/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ variantIds }),
            });
            const json = await res.json();
            const inventoryData: Array<{
                variantId: string;
                isAvailable: boolean;
                availableStock: number;
            }> = json.data ?? [];

            const issues: InventoryIssue[] = [];
            for (const item of items) {
                const inv = inventoryData.find(
                    (d) => d.variantId === item.variantId,
                );
                if (!inv || !inv.isAvailable) {
                    issues.push({
                        variantId: item.variantId,
                        message: `"${item.productName}${item.variantName ? ` (${item.variantName})` : ""}" is out of stock.`,
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
        setIsCheckingOut(true);
        setInventoryIssues([]);

        try {
            // Step 1 — inventory check
            const inventoryOk = await validateInventory();
            if (!inventoryOk) {
                setIsCheckingOut(false);
                toast({
                    title: "Stock issue",
                    description:
                        "Some items are unavailable. Please review your cart.",
                    variant: "destructive",
                });
                return;
            }

            // Step 2 — call the Server Action directly instead of fetch
            const res = await checkout({
                locationId: "loc_123", // This should be dynamic in a real app
                enableStockTracking: true,
                payments: [
                    {
                        method: "CASH",
                        amount: getCartTotal(),
                    },
                ],
            });

            // Assuming `checkout` throws on failure or returns an error object,
            // but based on your cart.ts, it returns { success: boolean; data: any }
            if (!res || res.success === false) {
                throw new Error("Checkout failed. Please check your details.");
            }

            // Step 3 — clear local state and show success
            await clearCart();
            setOrderSuccess(res.data?.id ?? "Order Confirmed");
            toast({
                title: "Order placed!",
                description: "Your order has been confirmed.",
            });
        } catch (err: any) {
            console.error("Checkout error:", err);
            toast({
                title: "Checkout failed",
                description: err.message ?? "Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsCheckingOut(false);
        }
    };

    // ── Order success screen ──────────────────────────────────────────────────
    if (orderSuccess) {
        return (
            <div className="min-h-screen">
                <div
                    className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}
                >
                    <Header user={user} />
                </div>
                <main className="pt-20 pb-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-md mx-auto text-center py-16 space-y-6">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                            <h1 className="text-3xl font-display font-bold text-foreground">
                                Order Confirmed!
                            </h1>
                            <p className="text-muted-foreground">
                                Order{" "}
                                <span className="font-semibold text-foreground">
                                    {orderSuccess}
                                </span>{" "}
                                has been placed and is being prepared.
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
                <div
                    className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}
                >
                    <Header user={user} />
                </div>
                <main className="pt-20 pb-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-24 bg-muted/30 rounded-lg animate-pulse"
                                />
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
                <div
                    className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}
                >
                    <Header user={user} />
                </div>
                <main className="pt-20 pb-8">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center py-12">
                            <h1 className="text-3xl font-display font-bold text-foreground mb-4">
                                Your Cart is Empty
                            </h1>
                            <p className="text-muted-foreground mb-8">
                                Add some delicious items from our menu to get
                                started.
                            </p>
                            <Button asChild size="lg" variant="hero">
                                <Link href="/products">
                                    <ArrowLeft className="h-5 w-5 mr-2" />
                                    Browse Products
                                </Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const earnedPoints = Math.floor(subtotal);

    return (
        <div className="min-h-screen">
            <div
                className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}
            >
                <Header user={user} />
            </div>

            <main className="pt-20 pb-8">
                {/* Mobile header */}
                <div
                    className={`sticky z-40 bg-background/95 backdrop-blur-xs border-b border-border md:hidden transition-all duration-300 ${isHeaderVisible ? "top-16" : "top-0"}`}
                >
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="p-2 -ml-2"
                        >
                            <Link href="/products">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
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
                                    <div
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-destructive"
                                    >
                                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span>{issue.message}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {items.map((item) => {
                                    const hasIssue = inventoryIssues.some(
                                        (i) => i.variantId === item.variantId,
                                    );
                                    const itemTotal =
                                        item.variantPrice * item.quantity;

                                    return (
                                        <Card
                                            key={`${item.productId}-${item.variantId}`}
                                            className={
                                                hasIssue
                                                    ? "border-destructive/50"
                                                    : ""
                                            }
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h3 className="font-display font-semibold text-foreground text-lg">
                                                                    {
                                                                        item.productName
                                                                    }
                                                                </h3>
                                                                {item.variantName && (
                                                                    <p className="text-muted-foreground text-sm">
                                                                        {
                                                                            item.variantName
                                                                        }
                                                                    </p>
                                                                )}
                                                                {hasIssue && (
                                                                    <Badge
                                                                        variant="destructive"
                                                                        className="text-xs mt-1"
                                                                    >
                                                                        Unavailable
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        item.variantId,
                                                                    )
                                                                }
                                                                className="text-muted-foreground hover:text-destructive shrink-0"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>

                                                        {item.addOns.length >
                                                            0 && (
                                                            <div className="mb-3">
                                                                <p className="text-sm text-muted-foreground mb-1">
                                                                    Add-ons:
                                                                </p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {item.addOns.map(
                                                                        (
                                                                            addon,
                                                                            idx,
                                                                        ) => (
                                                                            <Badge
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                variant="secondary"
                                                                                className="text-xs"
                                                                            >
                                                                                {
                                                                                    addon.name
                                                                                }{" "}
                                                                                (+Ksh{" "}
                                                                                {addon.price.toFixed(
                                                                                    2,
                                                                                )}

                                                                                )
                                                                            </Badge>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex items-center justify-between mt-3">
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.variantId,
                                                                            item.quantity,
                                                                            item.quantity -
                                                                                1,
                                                                        )
                                                                    }
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="font-medium text-foreground min-w-8 text-center">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        updateQuantity(
                                                                            item.variantId,
                                                                            item.quantity,
                                                                            item.quantity +
                                                                                1,
                                                                        )
                                                                    }
                                                                    className="h-8 w-8 p-0"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="font-semibold text-foreground">
                                                                    Ksh{" "}
                                                                    {itemTotal.toLocaleString()}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Ksh{" "}
                                                                    {item.variantPrice.toLocaleString()}{" "}
                                                                    each
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
                                <div
                                    className={`sticky transition-all duration-300 ${isHeaderVisible ? "top-32" : "top-16"}`}
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="font-display">
                                                Order Summary
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Subtotal
                                                </span>
                                                <span className="font-medium">
                                                    Ksh{" "}
                                                    {subtotal.toLocaleString()}
                                                </span>
                                            </div>

                                            <Separator />

                                            {/* Loyalty Points */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Gift className="h-4 w-4 text-secondary" />
                                                    <span className="font-medium text-foreground">
                                                        Loyalty Points
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Current Balance
                                                    </span>
                                                    <span className="font-medium text-secondary">
                                                        {loyaltyPoints} pts
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">
                                                        Will Earn
                                                    </span>
                                                    <span className="font-medium text-secondary">
                                                        +{earnedPoints} pts
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span className="text-foreground">
                                                        New Balance
                                                    </span>
                                                    <span className="text-secondary">
                                                        {loyaltyPoints +
                                                            earnedPoints}{" "}
                                                        pts
                                                    </span>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total</span>
                                                <span>
                                                    Ksh{" "}
                                                    {subtotal.toLocaleString()}
                                                </span>
                                            </div>

                                            <Button
                                                size="lg"
                                                variant="hero"
                                                className="w-full"
                                                onClick={handleCheckout}
                                                disabled={
                                                    isCheckingOut ||
                                                    inventoryIssues.length > 0
                                                }
                                            >
                                                {isCheckingOut
                                                    ? "Placing Order..."
                                                    : "Proceed to Checkout"}
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="lg"
                                                asChild
                                                className="w-full"
                                            >
                                                <Link href="/products">
                                                    Continue Shopping
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CartClient;
