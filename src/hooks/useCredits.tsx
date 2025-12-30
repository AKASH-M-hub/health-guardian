import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  total_earned: number;
  total_spent: number;
  last_login_credit_date: string | null;
}

export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create credits entry if doesn't exist (for existing users)
        const { data: newData, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: user.id,
            credits: 10,
            total_earned: 10,
            last_login_credit_date: new Date().toISOString().split('T')[0]
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setCredits(newData);
      } else {
        // Check for daily login bonus
        const today = new Date().toISOString().split('T')[0];
        if (data.last_login_credit_date !== today) {
          const newCredits = data.credits + 10;
          const { data: updatedData, error: updateError } = await supabase
            .from('user_credits')
            .update({
              credits: newCredits,
              total_earned: data.total_earned + 10,
              last_login_credit_date: today
            })
            .eq('user_id', user.id)
            .select()
            .single();

          if (!updateError && updatedData) {
            setCredits(updatedData);
            toast({
              title: '🎉 Daily Bonus!',
              description: 'You received 10 free credits for logging in today!',
            });
          } else {
            setCredits(data);
          }
        } else {
          setCredits(data);
        }
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const spendCredits = async (amount: number): Promise<boolean> => {
    if (!credits || credits.credits < amount) {
      toast({
        title: 'Insufficient Credits',
        description: `You need ${amount} credits but only have ${credits?.credits ?? 0}`,
        variant: 'destructive',
      });
      return false;
    }

    try {
      const newCredits = credits.credits - amount;
      const { error } = await supabase
        .from('user_credits')
        .update({
          credits: newCredits,
          total_spent: credits.total_spent + amount
        })
        .eq('user_id', user!.id);

      if (error) throw error;

      setCredits(prev => prev ? {
        ...prev,
        credits: newCredits,
        total_spent: prev.total_spent + amount
      } : null);

      return true;
    } catch (error) {
      console.error('Error spending credits:', error);
      toast({
        title: 'Error',
        description: 'Failed to process credits',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    credits: credits?.credits ?? 0,
    totalEarned: credits?.total_earned ?? 0,
    totalSpent: credits?.total_spent ?? 0,
    loading,
    spendCredits,
    refreshCredits: fetchCredits
  };
}