-- SPECTER Database Schema
-- Paranormal Investigation Game

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- Stores user profile information
-- =============================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =============================================
-- CASES TABLE
-- Stores investigation cases
-- =============================================
CREATE TABLE public.cases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    codename TEXT,
    description TEXT,
    briefing TEXT,
    difficulty INTEGER DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
    is_free BOOLEAN DEFAULT FALSE,
    price_cents INTEGER DEFAULT 0,
    solution_layer_1 TEXT,
    solution_layer_2 TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- Cases policies (public can view published cases)
CREATE POLICY "Anyone can view published cases"
    ON public.cases FOR SELECT
    USING (is_published = TRUE);

-- =============================================
-- EVIDENCE TABLE
-- Stores evidence items for each case
-- =============================================
CREATE TABLE public.evidence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    evidence_number TEXT NOT NULL,
    title TEXT NOT NULL,
    evidence_type TEXT CHECK (evidence_type IN ('document', 'image', 'audio', 'video', 'map', 'transcript', 'report')),
    content TEXT,
    file_url TEXT,
    metadata JSONB DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_redacted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(case_id, evidence_number)
);

-- Enable RLS
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

-- Evidence policies
CREATE POLICY "Anyone can view evidence for published cases"
    ON public.evidence FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.cases
            WHERE cases.id = evidence.case_id
            AND cases.is_published = TRUE
        )
    );

-- =============================================
-- USER_PROGRESS TABLE
-- Tracks user progress on cases
-- =============================================
CREATE TABLE public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'completed')),
    notes TEXT,
    bookmarked_evidence UUID[] DEFAULT '{}',
    submission TEXT,
    submission_correct BOOLEAN,
    submitted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, case_id)
);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- User progress policies
CREATE POLICY "Users can view their own progress"
    ON public.user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
    ON public.user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
    ON public.user_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- =============================================
-- PURCHASES TABLE
-- Tracks user purchases
-- =============================================
CREATE TABLE public.purchases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    purchase_type TEXT CHECK (purchase_type IN ('case', 'subscription')),
    stripe_payment_id TEXT,
    amount_cents INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Purchases policies
CREATE POLICY "Users can view their own purchases"
    ON public.purchases FOR SELECT
    USING (auth.uid() = user_id);

-- =============================================
-- FUNCTION: Handle new user creation
-- Automatically creates a profile when user signs up
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'username',
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- INDEXES for better performance
-- =============================================
CREATE INDEX idx_evidence_case_id ON public.evidence(case_id);
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_case_id ON public.user_progress(case_id);
CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_cases_is_published ON public.cases(is_published);
