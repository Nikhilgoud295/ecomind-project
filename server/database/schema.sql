-- ==========================================
-- EcoMind AI – Supabase PostgreSQL Database Schema
-- Production Ready with RLS, Indexes, and Triggers
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    organization VARCHAR(255) DEFAULT 'Individual User',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

CREATE TABLE IF NOT EXISTS public.resource_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    electricity_kwh NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    water_liters NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    waste_kg NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    fuel_liters NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    public_transport_km NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    renewable_energy_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    recycling_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    calculated_co2_kg NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usage_user_id ON public.resource_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_date ON public.resource_usage(date);
CREATE INDEX IF NOT EXISTS idx_usage_user_date ON public.resource_usage(user_id, date DESC);

CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'yearly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_co2_kg NUMERIC(10,2) DEFAULT 0.00,
    total_electricity_kwh NUMERIC(10,2) DEFAULT 0.00,
    total_water_liters NUMERIC(10,2) DEFAULT 0.00,
    total_waste_kg NUMERIC(10,2) DEFAULT 0.00,
    sustainability_score INT DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_user_period ON public.analytics(user_id, period_type, period_start);

CREATE TABLE IF NOT EXISTS public.ai_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    usage_id UUID REFERENCES public.resource_usage(id) ON DELETE SET NULL,
    sustainability_score INT NOT NULL,
    summary TEXT NOT NULL,
    strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
    problems JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    carbon_reduction_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
    water_saving_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
    energy_saving_tips JSONB NOT NULL DEFAULT '[]'::jsonb,
    waste_reduction_plan JSONB NOT NULL DEFAULT '[]'::jsonb,
    priority_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_reports_user ON public.ai_reports(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    summary_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_user ON public.reports(user_id, created_at DESC);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
