-- Mental Health Assessment Questionnaire Tables

-- Questionnaire Responses
CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_score INTEGER NOT NULL,
  anxiety_score INTEGER DEFAULT 0,
  depression_score INTEGER DEFAULT 0,
  stress_score INTEGER DEFAULT 0,
  sleep_score INTEGER DEFAULT 0,
  social_score INTEGER DEFAULT 0,
  responses JSONB NOT NULL,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for questionnaire_responses
CREATE POLICY "Users can view their own responses"
  ON public.questionnaire_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own responses"
  ON public.questionnaire_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all responses"
  ON public.questionnaire_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

