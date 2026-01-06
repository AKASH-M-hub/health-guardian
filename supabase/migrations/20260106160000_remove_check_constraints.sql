-- Remove all CHECK constraints from health_entries to allow any data input
-- This allows users to enter any values without database validation restrictions

-- Drop the check constraints
ALTER TABLE public.health_entries 
  DROP CONSTRAINT IF EXISTS health_entries_sleep_quality_check,
  DROP CONSTRAINT IF EXISTS health_entries_activity_intensity_check,
  DROP CONSTRAINT IF EXISTS health_entries_stress_level_check,
  DROP CONSTRAINT IF EXISTS health_entries_diet_quality_check,
  DROP CONSTRAINT IF EXISTS health_entries_mood_check;

-- Remove check constraints from risk_assessments as well
ALTER TABLE public.risk_assessments
  DROP CONSTRAINT IF EXISTS risk_assessments_overall_risk_score_check,
  DROP CONSTRAINT IF EXISTS risk_assessments_risk_level_check;
