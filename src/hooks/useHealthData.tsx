import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Simple cache for health data
const healthDataCache: { [userId: string]: { data: HealthEntry[]; timestamp: number } } = {};
const CACHE_DURATION = 30000; // 30 seconds cache

interface HealthEntry {
  id: string;
  user_id: string;
  entry_date: string;
  sleep_hours: number | null;
  sleep_quality: number | null;
  stress_level: number | null;
  mood: number | null;
  diet_quality: number | null;
  physical_activity_minutes: number | null;
  activity_intensity: string | null;
  water_intake_liters: number | null;
  heart_rate: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface HealthStats {
  avgSleepHours: number;
  avgSleepQuality: number;
  avgStressLevel: number;
  avgMood: number;
  avgDietQuality: number;
  avgActivityMinutes: number;
  totalEntries: number;
  latestEntry: HealthEntry | null;
  weeklyTrend: 'improving' | 'stable' | 'declining';
}

export function useHealthData() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [stats, setStats] = useState<HealthStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealthData = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setEntries([]);
      setStats(null);
      setLoading(false);
      return;
    }

    // Check cache first for faster loading
    const cached = healthDataCache[user.id];
    const now = Date.now();
    if (!forceRefresh && cached && (now - cached.timestamp) < CACHE_DURATION) {
      setEntries(cached.data);
      processStats(cached.data);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('health_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false })
        .limit(30);

      if (error) throw error;

      const typedData = (data || []) as HealthEntry[];
      
      // Update cache
      healthDataCache[user.id] = { data: typedData, timestamp: now };
      setEntries(typedData);
      processStats(typedData);
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const processStats = useCallback((typedData: HealthEntry[]) => {
    if (typedData.length > 0) {
      const validSleep = typedData.filter(e => e.sleep_hours !== null);
      const validSleepQuality = typedData.filter(e => e.sleep_quality !== null);
      const validStress = typedData.filter(e => e.stress_level !== null);
      const validMood = typedData.filter(e => e.mood !== null);
      const validDiet = typedData.filter(e => e.diet_quality !== null);
      const validActivity = typedData.filter(e => e.physical_activity_minutes !== null);

      const avgSleepHours = validSleep.length > 0
        ? validSleep.reduce((sum, e) => sum + (e.sleep_hours || 0), 0) / validSleep.length
        : 0;

      const avgSleepQuality = validSleepQuality.length > 0
        ? validSleepQuality.reduce((sum, e) => sum + (e.sleep_quality || 0), 0) / validSleepQuality.length
        : 0;

      const avgStressLevel = validStress.length > 0
        ? validStress.reduce((sum, e) => sum + (e.stress_level || 0), 0) / validStress.length
        : 0;

      const avgMood = validMood.length > 0
        ? validMood.reduce((sum, e) => sum + (e.mood || 0), 0) / validMood.length
        : 0;

      const avgDietQuality = validDiet.length > 0
        ? validDiet.reduce((sum, e) => sum + (e.diet_quality || 0), 0) / validDiet.length
        : 0;

      const avgActivityMinutes = validActivity.length > 0
        ? validActivity.reduce((sum, e) => sum + (e.physical_activity_minutes || 0), 0) / validActivity.length
        : 0;

      let weeklyTrend: 'improving' | 'stable' | 'declining' = 'stable';
      if (typedData.length >= 7) {
        const recentMood = typedData.slice(0, 3).reduce((sum, e) => sum + (e.mood || 5), 0) / 3;
        const olderMood = typedData.slice(4, 7).reduce((sum, e) => sum + (e.mood || 5), 0) / 3;
        if (recentMood > olderMood + 0.5) weeklyTrend = 'improving';
        else if (recentMood < olderMood - 0.5) weeklyTrend = 'declining';
      }

      setStats({
        avgSleepHours: Math.round(avgSleepHours * 10) / 10,
        avgSleepQuality: Math.round(avgSleepQuality * 10) / 10,
        avgStressLevel: Math.round(avgStressLevel * 10) / 10,
        avgMood: Math.round(avgMood * 10) / 10,
        avgDietQuality: Math.round(avgDietQuality * 10) / 10,
        avgActivityMinutes: Math.round(avgActivityMinutes),
        totalEntries: typedData.length,
        latestEntry: typedData[0] || null,
        weeklyTrend
      });
    } else {
      setStats(null);
    }
  }, []);

  useEffect(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  const forceRefresh = useCallback(() => {
    if (user) {
      delete healthDataCache[user.id];
    }
    return fetchHealthData(true);
  }, [user, fetchHealthData]);

  return {
    entries,
    stats,
    loading,
    refreshData: forceRefresh
  };
}