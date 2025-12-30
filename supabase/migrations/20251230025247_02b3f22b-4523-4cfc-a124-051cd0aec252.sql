-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  gender TEXT,
  location TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create health_entries table for daily health data
CREATE TABLE public.health_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sleep_hours DECIMAL(4, 2),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  physical_activity_minutes INTEGER,
  activity_intensity TEXT CHECK (activity_intensity IN ('low', 'moderate', 'high')),
  stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
  diet_quality INTEGER CHECK (diet_quality >= 1 AND diet_quality <= 10),
  water_intake_liters DECIMAL(4, 2),
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  heart_rate INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, entry_date)
);

-- Enable RLS on health_entries
ALTER TABLE public.health_entries ENABLE ROW LEVEL SECURITY;

-- Health entries RLS policies
CREATE POLICY "Users can view their own health entries" ON public.health_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own health entries" ON public.health_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health entries" ON public.health_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health entries" ON public.health_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create risk_assessments table
CREATE TABLE public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  overall_risk_score DECIMAL(5, 2) CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  cardiovascular_risk DECIMAL(5, 2),
  metabolic_risk DECIMAL(5, 2),
  stress_related_risk DECIMAL(5, 2),
  sleep_related_risk DECIMAL(5, 2),
  key_factors JSONB,
  recommendations JSONB,
  confidence_score DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on risk_assessments
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

-- Risk assessments RLS policies
CREATE POLICY "Users can view their own risk assessments" ON public.risk_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own risk assessments" ON public.risk_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat messages RLS policies
CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat messages" ON public.chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_entries_updated_at
  BEFORE UPDATE ON public.health_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();