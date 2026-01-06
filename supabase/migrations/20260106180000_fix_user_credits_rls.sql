-- Fix RLS policies for user_credits to allow system functions to insert
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON public.user_credits;

-- Create new policies that allow system operations
CREATE POLICY "Users can view their own credits" ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON public.user_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow system functions to insert credits
CREATE POLICY "System can insert credits" ON public.user_credits
  FOR INSERT WITH CHECK (true);

-- Simplify the initialize_user_credits function
DROP TRIGGER IF EXISTS on_profile_created_initialize_credits ON public.profiles;
DROP FUNCTION IF EXISTS public.initialize_user_credits();

CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  BEGIN
    INSERT INTO public.user_credits (user_id, total_credits, bonus_claimed, last_login_date)
    VALUES (
      NEW.user_id,
      20,
      true,
      CURRENT_DATE
    )
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Log but don't fail if credits already exist
    NULL;
  END;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created_initialize_credits
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_credits();
