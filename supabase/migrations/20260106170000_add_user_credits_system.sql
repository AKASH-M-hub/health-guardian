-- Create user_credits table for credit management (if not exists)
CREATE TABLE IF NOT EXISTS public.user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  total_credits INTEGER DEFAULT 0 NOT NULL,
  bonus_claimed BOOLEAN DEFAULT false NOT NULL,
  last_login_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on user_credits
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON public.user_credits;

-- User credits RLS policies
CREATE POLICY "Users can view their own credits" ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON public.user_credits
  FOR UPDATE USING (auth.uid() = user_id);

-- Drop existing functions and triggers if they exist
DROP TRIGGER IF EXISTS on_profile_created_initialize_credits ON public.profiles;
DROP TRIGGER IF EXISTS update_user_credits_updated_at ON public.user_credits;
DROP FUNCTION IF EXISTS public.initialize_user_credits();
DROP FUNCTION IF EXISTS public.claim_daily_login_credits(UUID);

-- Create function to handle new user credit initialization
CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, total_credits, bonus_claimed, last_login_date)
  VALUES (
    NEW.user_id,
    20,
    true,
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$;

-- Create trigger for initializing user credits
CREATE TRIGGER on_profile_created_initialize_credits
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_credits();

-- Create function to add daily login credits
CREATE OR REPLACE FUNCTION public.claim_daily_login_credits(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_last_login DATE;
  v_today DATE := CURRENT_DATE;
  v_credits_awarded INTEGER := 0;
BEGIN
  -- Get the user's last login date
  SELECT last_login_date INTO v_last_login
  FROM public.user_credits
  WHERE user_id = p_user_id;

  -- Check if user can claim credits today (not claimed today yet)
  IF v_last_login IS NULL OR v_last_login < v_today THEN
    -- Award 10 daily login credits
    UPDATE public.user_credits
    SET 
      total_credits = total_credits + 10,
      last_login_date = v_today,
      updated_at = now()
    WHERE user_id = p_user_id;
    
    v_credits_awarded := 10;
  END IF;

  -- Return current credit info
  RETURN (
    SELECT json_build_object(
      'total_credits', total_credits,
      'credits_awarded_today', v_credits_awarded,
      'last_login_date', last_login_date,
      'bonus_claimed', bonus_claimed
    )
    FROM public.user_credits
    WHERE user_id = p_user_id
  );
END;
$$;

-- Create trigger for updating updated_at on user_credits
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

