import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DealioReview } from '@/lib/dealio/types';

export const useReviews = (productId: string) => {
  const [reviews, setReviews] = useState<DealioReview[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/dealio/reviews?productId=${productId}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data: DealioReview[] = await res.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const submitReview = async (review: { rating: number; title?: string; comment: string }) => {
    try {
      const res = await fetch('/api/dealio/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, ...review }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast({ title: 'Sign in required', description: 'Please sign in to leave a review', variant: 'destructive' });
          return false;
        }
        throw new Error('Failed to submit review');
      }
      
      await fetchReviews();
      toast({ title: 'Review submitted!', description: 'Thank you for your feedback' });
      return true;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({ title: 'Error', description: 'Failed to submit review', variant: 'destructive' });
      return false;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews,
    loading,
    submitReview,
    refreshReviews: fetchReviews,
  };
};
