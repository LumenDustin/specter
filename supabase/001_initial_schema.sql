-- SPECTER Game Database Schema
-- Initial Migration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Extended user data beyond Supabase Auth
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  cases_completed INTEGER DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- =====================================================
-- CASES TABLE
-- Paranormal investigation case files
-- =====================================================
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  case_number TEXT NOT NULL,
  classification TEXT DEFAULT 'AMBER',
  difficulty TEXT DEFAULT 'investigator',
  briefing TEXT NOT NULL,
  surface_solution TEXT NOT NULL,
  true_solution TEXT NOT NULL,
  is_free BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  estimated_time_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published cases
CREATE POLICY "Anyone can view published cases" 
  ON cases FOR SELECT 
  USING (is_published = true);

-- =====================================================
-- EVIDENCE TABLE
-- Individual pieces of evidence for each case
-- =====================================================
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  metadata JSONB,
  sort_order INTEGER DEFAULT 0,
  is_red_herring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view evidence for published cases" 
  ON evidence FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM cases 
      WHERE cases.id = evidence.case_id 
      AND cases.is_published = true
    )
  );

CREATE INDEX idx_evidence_case_id ON evidence(case_id);
CREATE INDEX idx_evidence_sort_order ON evidence(case_id, sort_order);

-- =====================================================
-- USER_PROGRESS TABLE
-- Track user progress through cases
-- =====================================================
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  notes TEXT,
  submitted_solution TEXT,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, case_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_case_id ON user_progress(case_id);

-- =====================================================
-- PURCHASES TABLE
-- Track individual case purchases (non-subscription)
-- =====================================================
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id),
  stripe_payment_id TEXT,
  amount_cents INTEGER,
  purchased_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" 
  ON purchases FOR SELECT 
  USING (auth.uid() = user_id);

CREATE INDEX idx_purchases_user_id ON purchases(user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
