import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Subscription {
  id: string;
  user_id: string;
  subscription_type: string;
  transaction_id: string | null;
  subscribed_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setIsPremium(false);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSubscription(data);
        setIsPremium(data.subscription_type === 'premium' && data.is_active);
      } else {
        setSubscription(null);
        setIsPremium(false);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const upgradeToPremium = async (transactionId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Check if subscription exists
      const { data: existing } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Update existing subscription
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            subscription_type: 'premium',
            transaction_id: transactionId,
            subscribed_at: new Date().toISOString(),
            is_active: true
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user.id,
            subscription_type: 'premium',
            transaction_id: transactionId,
            is_active: true
          });

        if (error) throw error;
      }

      await fetchSubscription();
      return true;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      return false;
    }
  };

  return {
    subscription,
    isPremium,
    loading,
    upgradeToPremium,
    refreshSubscription: fetchSubscription
  };
}
