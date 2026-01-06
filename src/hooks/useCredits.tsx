import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface UserCredits {
  credits: number;
  total_earned: number;
  total_spent: number;
  last_login_credit_date: string | null;
  credits_awarded_today?: number;
}

export function useCredits() {
  const { user, session } = useAuth();
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  const claimDailyCredits = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Get today's date in IST (UTC+5:30)
      const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
      const istDate = new Date(Date.now() + istOffset).toISOString().split('T')[0];
      
      const { data: currentData, error: fetchError } = await supabase
        .from('user_credits')
        .select('credits, total_earned, total_spent, last_login_credit_date')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // Check if credits were already claimed today in IST timezone
      if (currentData && currentData.last_login_credit_date !== istDate) {
        // Award 10 daily credits
        const { data: updatedData, error: updateError } = await supabase
          .from('user_credits')
          .update({
            credits: (currentData.credits || 0) + 10,
            total_earned: (currentData.total_earned || 0) + 10,
            last_login_credit_date: istDate
          })
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;

        if (updatedData) {
          setCredits(updatedData);
          toast({
            title: '+10 Login Credits!',
            description: `You now have ${updatedData.credits} total credits.`,
          });
        }
      } else if (currentData) {
        setCredits(currentData);
      }
    } catch (error) {
      console.error('Error claiming daily credits:', error);
      fetchCurrentCredits();
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchCurrentCredits = useCallback(async () => {
    if (!user) {
      setCredits(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits, total_earned, total_spent, last_login_credit_date')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCredits({
          credits: data.credits || 0,
          total_earned: data.total_earned || 0,
          total_spent: data.total_spent || 0,
          last_login_credit_date: data.last_login_credit_date,
        });
      } else {
        // New user should have been created with 20 bonus credits
        // Use IST timezone for consistency
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(Date.now() + istOffset).toISOString().split('T')[0];
        
        setCredits({
          credits: 20,
          total_earned: 20,
          total_spent: 0,
          last_login_credit_date: istDate,
        });
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCredits(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Try to claim daily credits on app load
      claimDailyCredits();
    }
  }, [user?.id]);

  return { 
    credits, 
    loading,
    refreshCredits: claimDailyCredits,
    fetchCredits: fetchCurrentCredits
  };
}