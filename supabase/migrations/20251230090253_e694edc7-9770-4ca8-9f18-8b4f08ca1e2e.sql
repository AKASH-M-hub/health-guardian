-- First drop the unique constraint that's causing issues
ALTER TABLE public.health_entries DROP CONSTRAINT IF EXISTS health_entries_user_id_entry_date_key;

-- Create user_credits table for the credits system
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  credits INTEGER NOT NULL DEFAULT 10,
  total_earned INTEGER NOT NULL DEFAULT 10,
  total_spent INTEGER NOT NULL DEFAULT 0,
  last_login_credit_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_credits
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_credits
CREATE POLICY "Users can view their own credits"
ON public.user_credits
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
ON public.user_credits
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits"
ON public.user_credits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_credits_updated_at
BEFORE UPDATE ON public.user_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user credits (give 10 credits on signup)
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits, total_earned, last_login_credit_date)
  VALUES (NEW.id, 10, 10, CURRENT_DATE);
  RETURN NEW;
END;
$$;

-- Trigger to create credits row on user signup
CREATE TRIGGER on_auth_user_created_credits
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_credits();