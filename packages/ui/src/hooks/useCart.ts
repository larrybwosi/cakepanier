import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@repo/ui/hooks/use-toast';
import { DealioCart, DealioCartItem } from '@repo/lib/dealio/types';

export interface CartAddOn {
  name: string;
  price: number;
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;       // Dealio variant CUID
  variantId: string;       // Alias for productId for compatibility
  productName: string;
  quantity: number;
  variantName?: string;
  variantPrice: number;    
  addOns: CartAddOn[];
  productImage?: string;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const { toast } = useToast();

  const fetchCartItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dealio/cart');
      if (!res.ok) {
        if (res.status === 401) return; // Not logged in
        throw new Error('Failed to fetch cart');
      }
      const cart: DealioCart & { items: any[] } = await res.json();

      const cartItems: CartItem[] = (cart.items ?? []).map((item: any) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId || item.productId,
        productName: item.productName || `Product ${item.productId.slice(-4)}`,
        quantity: item.quantity,
        variantName: item.variantName,
        variantPrice: Number(item.variantPrice ?? 0),
        productImage: item.productImage,
        addOns: item.addOns || [],
      }));

      setItems(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (variantId: string, quantity: number = 1) => {
    try {
      const res = await fetch('/api/dealio/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: variantId, quantity }),
      });

      if (!res.ok) throw new Error('Failed to add to cart');
      
      await fetchCartItems();
      toast({ title: 'Added to cart', description: 'Item added to your cart' });
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({ title: 'Error', description: 'Failed to add item to cart', variant: 'destructive' });
      return false;
    }
  };

  const updateQuantity = async (variantId: string, currentQuantity: number, newQuantity: number) => {
    if (newQuantity <= 0) return removeItem(variantId);
    
    // The API doc doesn't show a direct 'set' quantity.
    // It says POST /cart increments.
    // So we might need to send the difference.
    const diff = newQuantity - currentQuantity;
    
    if (diff > 0) {
      return addToCart(variantId, diff);
    } else if (diff < 0) {
      return removeItem(variantId, false); // false = don't remove entirely, just decrement
    }
  };

  const removeItem = async (variantId: string, removeEntirely: boolean = true) => {
    try {
      const res = await fetch(`/api/dealio/cart?productId=${variantId}&removeEntirely=${removeEntirely}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove item');
      
      await fetchCartItems();
      toast({ title: 'Cart updated', description: 'Your cart has been updated' });
    } catch (error) {
      console.error('Error removing item:', error);
      toast({ title: 'Error', description: 'Failed to update cart', variant: 'destructive' });
    }
  };

  const clearCart = async () => {
    await fetchCartItems();
  };

  const getCartTotal = () =>
    items.reduce((total, item) => total + (item.variantPrice) * item.quantity, 0);

  const getItemCount = () => items.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  return {
    items,
    loading,
    loyaltyPoints,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    getItemCount,
    refreshCart: fetchCartItems,
  };
};
