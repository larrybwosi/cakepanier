import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@repo/ui/hooks/use-toast';
import { DealioFavorite } from '@repo/lib/dealio/types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<DealioFavorite[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dealio/favorites');
      if (!res.ok) {
        if (res.status === 401) return; // Not logged in
        throw new Error('Failed to fetch favorites');
      }
      const data: DealioFavorite[] = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToFavorites = async (productId: string) => {
    try {
      const res = await fetch('/api/dealio/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error('Failed to add to favorites');
      
      await fetchFavorites();
      toast({ title: 'Added to favorites', description: 'Product added to your favorites' });
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast({ title: 'Error', description: 'Failed to add to favorites', variant: 'destructive' });
      return false;
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      const res = await fetch(`/api/dealio/favorites?productId=${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to remove from favorites');
      
      await fetchFavorites();
      toast({ title: 'Removed from favorites', description: 'Product removed from your favorites' });
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast({ title: 'Error', description: 'Failed to remove from favorites', variant: 'destructive' });
      return false;
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.productId === productId);
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites: fetchFavorites,
  };
};
