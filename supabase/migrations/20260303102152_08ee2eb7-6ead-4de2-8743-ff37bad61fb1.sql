
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'operator');

-- User roles table (separate from profiles per security requirement)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'operator',
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'operator');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Incidents table
CREATE TABLE public.incidents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical','high','medium','low','ok')),
  status TEXT NOT NULL DEFAULT 'detecting',
  sla_deadline TIMESTAMPTZ NOT NULL,
  symptoms TEXT[] DEFAULT '{}',
  confidence NUMERIC DEFAULT 0,
  top_signals TEXT[] DEFAULT '{}',
  suggested_action TEXT,
  executed_action TEXT,
  run_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read incidents" ON public.incidents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert incidents" ON public.incidents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update incidents" ON public.incidents FOR UPDATE TO authenticated USING (true);

-- Runs table
CREATE TABLE public.runs (
  id TEXT PRIMARY KEY,
  incident_id TEXT REFERENCES public.incidents(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  autonomy_mode TEXT NOT NULL DEFAULT 'observe',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  steps JSONB DEFAULT '[]',
  system TEXT,
  severity TEXT,
  agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read runs" ON public.runs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert runs" ON public.runs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update runs" ON public.runs FOR UPDATE TO authenticated USING (true);

-- Audit logs (immutable)
CREATE TABLE public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  detail TEXT,
  run_id TEXT,
  hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);
-- No UPDATE or DELETE policies — immutable

-- Voice calls
CREATE TABLE public.voice_calls (
  id TEXT PRIMARY KEY,
  direction TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  contact TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  summary TEXT,
  transcript JSONB,
  run_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.voice_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read voice calls" ON public.voice_calls FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert voice calls" ON public.voice_calls FOR INSERT TO authenticated WITH CHECK (true);

-- User roles RLS
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
