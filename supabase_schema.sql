-- Enable RLS on all tables
-- Create tables for the marketplace

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'seller', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES public.users(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipping', 'delivered', 'cancelled')),
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies (public read)
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Products policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (is_active = true OR seller_id = auth.uid());

DROP POLICY IF EXISTS "Sellers can manage own products" ON public.products;
CREATE POLICY "Sellers can manage own products" ON public.products
  FOR ALL USING (seller_id = auth.uid());

-- Cart items policies
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;
CREATE POLICY "Users can manage own cart" ON public.cart_items
  FOR ALL USING (user_id = auth.uid());

-- Favorites policies
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (user_id = auth.uid());

-- Orders policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Reviews policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own reviews" ON public.reviews;
CREATE POLICY "Users can manage own reviews" ON public.reviews
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (user_id = auth.uid());

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS handle_updated_at_users ON public.users;
CREATE TRIGGER handle_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_products ON public.products;
CREATE TRIGGER handle_updated_at_products
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_cart_items ON public.cart_items;
CREATE TRIGGER handle_updated_at_cart_items
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_orders ON public.orders;
CREATE TRIGGER handle_updated_at_orders
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Eletrônicos', 'eletronicos', 'Produtos eletrônicos e tecnologia'),
  ('Roupas', 'roupas', 'Moda e vestuário'),
  ('Casa e Decoração', 'casa-decoracao', 'Itens para casa e decoração'),
  ('Livros', 'livros', 'Livros e material educativo'),
  ('Esportes', 'esportes', 'Artigos esportivos e fitness')
ON CONFLICT (slug) DO NOTHING;

-- Communities table for scheduling system
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  operating_hours JSONB DEFAULT '{"monday": {"start": "08:00", "end": "18:00"}, "tuesday": {"start": "08:00", "end": "18:00"}, "wednesday": {"start": "08:00", "end": "18:00"}, "thursday": {"start": "08:00", "end": "18:00"}, "friday": {"start": "08:00", "end": "18:00"}, "saturday": {"closed": true}, "sunday": {"closed": true}}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table for community services
CREATE TABLE IF NOT EXISTS public.community_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  price DECIMAL(10,2) DEFAULT 0,
  max_participants INTEGER DEFAULT 1,
  category TEXT NOT NULL,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service availability slots
CREATE TABLE IF NOT EXISTS public.service_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.community_services(id) NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_slots INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  service_id UUID REFERENCES public.community_services(id) NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
  notes TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables

-- Communities policies (public read)
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;
CREATE POLICY "Communities are viewable by everyone" ON public.communities
  FOR SELECT USING (is_active = true);

-- Community services policies (public read)
DROP POLICY IF EXISTS "Community services are viewable by everyone" ON public.community_services;
CREATE POLICY "Community services are viewable by everyone" ON public.community_services
  FOR SELECT USING (is_active = true);

-- Service availability policies (public read)
DROP POLICY IF EXISTS "Service availability is viewable by everyone" ON public.service_availability;
CREATE POLICY "Service availability is viewable by everyone" ON public.service_availability
  FOR SELECT USING (is_active = true);

-- Appointments policies
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own appointments" ON public.appointments;
CREATE POLICY "Users can create own appointments" ON public.appointments
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
CREATE POLICY "Users can update own appointments" ON public.appointments
  FOR UPDATE USING (user_id = auth.uid());

-- Triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at_appointments ON public.appointments;
CREATE TRIGGER handle_updated_at_appointments
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample communities
INSERT INTO public.communities (name, slug, description, address, phone, email, image_url) VALUES
  ('Paraisópolis', 'paraisopolis', 'Centro Comunitário de Paraisópolis oferecendo serviços essenciais para a comunidade local.', 'Rua Pasquale Gallupi, 245 - Paraisópolis, São Paulo - SP', '(11) 3031-9999', 'contato@paraisopolis.org.br', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'),
  ('Heliópolis', 'heliopolis', 'Centro Comunitário de Heliópolis promovendo desenvolvimento social e capacitação profissional.', 'Rua São João Clímaco, 2167 - Heliópolis, São Paulo - SP', '(11) 2274-8888', 'contato@heliopolis.org.br', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample services for Paraisópolis
INSERT INTO public.community_services (community_id, name, description, duration_minutes, price, category, requirements) 
SELECT 
  c.id,
  s.name,
  s.description,
  s.duration_minutes,
  s.price,
  s.category,
  s.requirements
FROM public.communities c
CROSS JOIN (VALUES
  ('Consulta Médica Geral', 'Atendimento médico básico com clínico geral. Consultas preventivas e tratamento de problemas de saúde comuns.', 30, 20.00, 'Saúde', 'Documento com foto e cartão SUS'),
  ('Aula de Informática Básica', 'Curso de informática para iniciantes. Aprenda a usar computador, internet e programas básicos.', 90, 0.00, 'Educação', 'Idade mínima: 16 anos'),
  ('Oficina de Costura', 'Aprenda técnicas de costura e confecção. Desenvolvimento de habilidades para geração de renda.', 120, 15.00, 'Capacitação', 'Trazer tecido e linha próprios'),
  ('Atendimento Jurídico', 'Orientação jurídica gratuita com advogados voluntários. Direito civil, trabalhista e família.', 45, 0.00, 'Jurídico', 'Documentos relacionados ao caso'),
  ('Curso de Empreendedorismo', 'Workshop sobre como abrir e gerir um pequeno negócio. Planejamento financeiro e marketing.', 180, 25.00, 'Capacitação', 'Idade mínima: 18 anos')
) s(name, description, duration_minutes, price, category, requirements)
WHERE c.slug = 'paraisopolis';

-- Insert sample services for Heliópolis
INSERT INTO public.community_services (community_id, name, description, duration_minutes, price, category, requirements) 
SELECT 
  c.id,
  s.name,
  s.description,
  s.duration_minutes,
  s.price,
  s.category,
  s.requirements
FROM public.communities c
CROSS JOIN (VALUES
  ('Consulta Odontológica', 'Atendimento odontológico básico. Limpeza, avaliação e tratamentos preventivos.', 45, 30.00, 'Saúde', 'Documento com foto e cartão SUS'),
  ('Aula de Inglês Básico', 'Curso de inglês para iniciantes. Focado em conversação e vocabulário do dia a dia.', 60, 10.00, 'Educação', 'Material didático incluso'),
  ('Oficina de Marcenaria', 'Aprenda técnicas básicas de marcenaria. Construção de móveis simples e reparos.', 150, 35.00, 'Capacitação', 'Usar roupas adequadas e sapatos fechados'),
  ('Atendimento Psicológico', 'Atendimento psicológico individual. Apoio emocional e orientação terapêutica.', 50, 0.00, 'Saúde', 'Agendamento apenas por telefone'),
  ('Curso de Culinária', 'Workshop de culinária básica e saudável. Receitas práticas e econômicas.', 120, 20.00, 'Capacitação', 'Trazer avental e touca')
) s(name, description, duration_minutes, price, category, requirements)
WHERE c.slug = 'heliopolis';

-- Insert sample availability slots (Monday to Friday, different times for each service)
WITH service_times AS (
  SELECT 
    cs.id as service_id,
    generate_series(1, 5) as day_of_week, -- Monday to Friday
    CASE 
      WHEN cs.category = 'Saúde' THEN '08:00'::time
      WHEN cs.category = 'Educação' THEN '14:00'::time
      WHEN cs.category = 'Capacitação' THEN '09:00'::time
      WHEN cs.category = 'Jurídico' THEN '10:00'::time
      ELSE '08:00'::time
    END as start_time,
    CASE 
      WHEN cs.category = 'Saúde' THEN '17:00'::time
      WHEN cs.category = 'Educação' THEN '17:00'::time
      WHEN cs.category = 'Capacitação' THEN '16:00'::time
      WHEN cs.category = 'Jurídico' THEN '16:00'::time
      ELSE '17:00'::time
    END as end_time,
    CASE 
      WHEN cs.name LIKE '%Aula%' OR cs.name LIKE '%Curso%' OR cs.name LIKE '%Oficina%' THEN 15
      ELSE 3
    END as max_slots
  FROM public.community_services cs
)
INSERT INTO public.service_availability (service_id, day_of_week, start_time, end_time, max_slots)
SELECT service_id, day_of_week, start_time, end_time, max_slots
FROM service_times;