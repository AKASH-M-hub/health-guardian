-- Migrate existing users to credit system using correct columns
-- Add credits for users who don't have any yet

INSERT INTO public.user_credits (user_id, credits, total_earned, total_spent, last_login_credit_date)
SELECT 
  id as user_id,
  20 as credits,
  20 as total_earned,
  0 as total_spent,
  CURRENT_DATE as last_login_credit_date
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_credits)
ON CONFLICT (user_id) DO NOTHING;


