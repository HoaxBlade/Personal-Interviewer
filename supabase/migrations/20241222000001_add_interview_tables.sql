-- Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    job_position text,
    company_name text,
    difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
    status text CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    duration_minutes integer DEFAULT 0,
    score integer CHECK (score >= 0 AND score <= 100),
    feedback_summary text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    completed_at timestamp with time zone
);

-- Interview Questions Table
CREATE TABLE IF NOT EXISTS public.interview_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
    question_text text NOT NULL,
    question_type text CHECK (question_type IN ('behavioral', 'technical', 'situational', 'general')) DEFAULT 'general',
    difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    expected_answer text,
    user_answer text,
    ai_feedback text,
    score integer CHECK (score >= 0 AND score <= 10),
    time_taken_seconds integer DEFAULT 0,
    order_index integer NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_interviews integer DEFAULT 0,
    completed_interviews integer DEFAULT 0,
    average_score numeric(5,2) DEFAULT 0,
    improvement_percentage numeric(5,2) DEFAULT 0,
    strengths text[],
    areas_for_improvement text[],
    last_interview_date timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id)
);

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    description text,
    price_monthly numeric(10,2) NOT NULL,
    price_yearly numeric(10,2),
    features text[] NOT NULL,
    max_interviews_per_month integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- User Subscriptions Table
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
    status text CHECK (status IN ('active', 'cancelled', 'expired', 'trial')) DEFAULT 'trial',
    billing_cycle text CHECK (billing_cycle IN ('monthly', 'yearly')) DEFAULT 'monthly',
    current_period_start timestamp with time zone NOT NULL,
    current_period_end timestamp with time zone NOT NULL,
    stripe_subscription_id text,
    stripe_customer_id text,
    interviews_used_this_month integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id)
);

-- Question Bank Table
CREATE TABLE IF NOT EXISTS public.question_bank (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text text NOT NULL,
    question_type text CHECK (question_type IN ('behavioral', 'technical', 'situational', 'general')) DEFAULT 'general',
    difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    industry text,
    job_role text,
    tags text[],
    sample_answer text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- User Feedback Table
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_id uuid REFERENCES public.interview_sessions(id) ON DELETE SET NULL,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    feedback_text text,
    feedback_type text CHECK (feedback_type IN ('general', 'bug_report', 'feature_request', 'interview_quality')) DEFAULT 'general',
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_id ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON public.interview_sessions(status);
CREATE INDEX IF NOT EXISTS idx_interview_questions_session_id ON public.interview_questions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_question_bank_type_difficulty ON public.question_bank(question_type, difficulty);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON public.user_feedback(user_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, max_interviews_per_month) VALUES
('Free Trial', '7-day free trial with limited features', 0, 0, ARRAY['3 practice interviews', 'Basic feedback', 'Limited question bank'], 3),
('Monthly', 'Full access with monthly billing', 29, 0, ARRAY['Unlimited practice interviews', 'Detailed feedback & analysis', 'Full question bank access', 'Progress tracking'], NULL),
('Annual', 'Full access with yearly billing (save $149)', 0, 199, ARRAY['Everything in Monthly', 'Priority support', 'Early access to new features', 'Resume review'], NULL)
ON CONFLICT (name) DO NOTHING;

-- Enable realtime for all tables
alter publication supabase_realtime add table interview_sessions;
alter publication supabase_realtime add table interview_questions;
alter publication supabase_realtime add table user_progress;
alter publication supabase_realtime add table subscription_plans;
alter publication supabase_realtime add table user_subscriptions;
alter publication supabase_realtime add table question_bank;
alter publication supabase_realtime add table user_feedback;

-- Create function to update user progress after interview completion
CREATE OR REPLACE FUNCTION update_user_progress()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO public.user_progress (user_id, total_interviews, completed_interviews, last_interview_date)
        VALUES (NEW.user_id, 1, 1, NEW.completed_at)
        ON CONFLICT (user_id) DO UPDATE SET
            total_interviews = user_progress.total_interviews + 1,
            completed_interviews = user_progress.completed_interviews + 1,
            last_interview_date = NEW.completed_at,
            updated_at = timezone('utc'::text, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating user progress
DROP TRIGGER IF EXISTS on_interview_completed ON public.interview_sessions;
CREATE TRIGGER on_interview_completed
    AFTER UPDATE ON public.interview_sessions
    FOR EACH ROW EXECUTE FUNCTION update_user_progress();

-- Create function to initialize user subscription on signup
CREATE OR REPLACE FUNCTION initialize_user_subscription()
RETURNS TRIGGER AS $$
DECLARE
    trial_plan_id uuid;
BEGIN
    -- Get the trial plan ID
    SELECT id INTO trial_plan_id FROM public.subscription_plans WHERE name = 'Free Trial' LIMIT 1;
    
    IF trial_plan_id IS NOT NULL THEN
        INSERT INTO public.user_subscriptions (
            user_id,
            plan_id,
            status,
            current_period_start,
            current_period_end
        ) VALUES (
            NEW.id,
            trial_plan_id,
            'trial',
            timezone('utc'::text, now()),
            timezone('utc'::text, now()) + interval '7 days'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to initialize subscription for new users
DROP TRIGGER IF EXISTS on_user_subscription_init ON public.users;
CREATE TRIGGER on_user_subscription_init
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION initialize_user_subscription();