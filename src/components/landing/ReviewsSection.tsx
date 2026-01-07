import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  display_name: string | null;
  rating: number | null;
  review_text: string | null;
  created_at: string;
}

export function ReviewsSection() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const loadReviews = async () => {
    try {
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const submit = async () => {
    if (!user) {
      toast({ title: 'Please sign in to leave a review', variant: 'destructive' });
      return;
    }
    if (!text.trim()) {
      toast({ title: 'Please write a review', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        display_name: name || user.email,
        rating,
        review_text: text.trim()
      });

      if (error) {
        toast({ title: error.message, variant: 'destructive' });
        return;
      }

      setText('');
      setName('');
      setRating(5);
      toast({ title: 'Thank you for your review!' });
      loadReviews();
    } catch (error: any) {
      toast({ title: error.message || 'Error submitting review', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Reviews</h2>
          <p className="text-muted-foreground">What our users say. Share your experience with SDOP.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Write Review Form */}
          <Card>
            <CardHeader>
              <CardTitle>Leave a Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-sm"
              />
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRating(r)}
                      className={`transition-colors ${
                        rating >= r ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Share your experience..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-24 text-sm"
              />
              <Button
                onClick={submit}
                disabled={loading || !user}
                className="w-full"
              >
                {loading ? 'Submitting...' : 'Submit Review'}
              </Button>
              {!user && (
                <p className="text-xs text-muted-foreground text-center">
                  Sign in to submit a review
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reviews List */}
          <div className="space-y-3">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <Card key={r.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm">{r.display_name || 'Anonymous'}</p>
                      {r.rating && (
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{r.review_text}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No reviews yet. Be the first to share your experience!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
