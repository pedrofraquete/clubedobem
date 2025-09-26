# Instruções para Setup do Banco Supabase

## 🔧 Passo 1: Execute no SQL Editor do Supabase

Acesse https://nbegwhqnlafwkxcoppyk.supabase.co/project/nbegwhqnlafwkxcoppyk/sql/new

Cole e execute este SQL:

```sql
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
```

## 🔧 Passo 2: Inserir Dados de Exemplo

Depois de executar o primeiro script, execute este segundo script para adicionar produtos de exemplo:

```sql
-- Primeiro, crie um usuário fictício para ser o vendedor
-- Substitua este UUID pelo seu ID de usuário real se já tiver criado uma conta
INSERT INTO public.users (id, email, full_name, role) VALUES 
('00000000-0000-0000-0000-000000000001', 'vendedor@exemplo.com', 'Vendedor Exemplo', 'seller')
ON CONFLICT (id) DO NOTHING;

-- Inserir produtos de exemplo
INSERT INTO public.products (name, description, price, images, category_id, rating, rating_count, stock, seller_id) VALUES 
  ('Smartphone Android', 'Smartphone com 128GB de armazenamento, câmera dupla e tela de 6.5"', 899.99, 
   ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'], 
   (SELECT id FROM categories WHERE slug = 'eletronicos'), 4.5, 120, 50, 
   '00000000-0000-0000-0000-000000000001'),

  ('Notebook Gaming', 'Notebook gamer com RTX 3060, 16GB RAM, SSD 512GB', 3499.99,
   ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
   (SELECT id FROM categories WHERE slug = 'eletronicos'), 4.8, 85, 25,
   '00000000-0000-0000-0000-000000000001'),

  ('Fones Bluetooth', 'Fones de ouvido sem fio com cancelamento de ruído', 299.99,
   ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
   (SELECT id FROM categories WHERE slug = 'eletronicos'), 4.3, 200, 100,
   '00000000-0000-0000-0000-000000000001'),

  ('Camiseta Básica', 'Camiseta 100% algodão, diversas cores disponíveis', 39.99,
   ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
   (SELECT id FROM categories WHERE slug = 'roupas'), 4.2, 150, 200,
   '00000000-0000-0000-0000-000000000001'),

  ('Jeans Premium', 'Calça jeans premium com corte moderno', 159.99,
   ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
   (SELECT id FROM categories WHERE slug = 'roupas'), 4.6, 90, 75,
   '00000000-0000-0000-0000-000000000001'),

  ('Vestido Floral', 'Vestido floral perfeito para o verão', 89.99,
   ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'],
   (SELECT id FROM categories WHERE slug = 'roupas'), 4.4, 65, 40,
   '00000000-0000-0000-0000-000000000001'),

  ('Vaso Decorativo', 'Vaso cerâmico artesanal para plantas', 79.99,
   ARRAY['https://images.unsplash.com/photo-1493663284031-b7e3aab21900?w=400'],
   (SELECT id FROM categories WHERE slug = 'casa-decoracao'), 4.7, 45, 30,
   '00000000-0000-0000-0000-000000000001'),

  ('Kit Almofadas', 'Kit com 4 almofadas decorativas', 149.99,
   ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
   (SELECT id FROM categories WHERE slug = 'casa-decoracao'), 4.1, 35, 20,
   '00000000-0000-0000-0000-000000000001'),

  ('Luminária LED', 'Luminária LED moderna com controle remoto', 199.99,
   ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'],
   (SELECT id FROM categories WHERE slug = 'casa-decoracao'), 4.5, 80, 45,
   '00000000-0000-0000-0000-000000000001'),

  ('Romance Nacional', 'Bestseller da literatura brasileira contemporânea', 34.99,
   ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
   (SELECT id FROM categories WHERE slug = 'livros'), 4.8, 220, 150,
   '00000000-0000-0000-0000-000000000001'),

  ('Guia de Programação', 'Aprenda programação do zero ao avançado', 89.99,
   ARRAY['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'],
   (SELECT id FROM categories WHERE slug = 'livros'), 4.9, 180, 80,
   '00000000-0000-0000-0000-000000000001'),

  ('Livro de Receitas', '100 receitas práticas para o dia a dia', 49.99,
   ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
   (SELECT id FROM categories WHERE slug = 'livros'), 4.3, 95, 60,
   '00000000-0000-0000-0000-000000000001'),

  ('Tênis Running', 'Tênis para corrida com amortecimento avançado', 249.99,
   ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
   (SELECT id FROM categories WHERE slug = 'esportes'), 4.6, 140, 90,
   '00000000-0000-0000-0000-000000000001'),

  ('Bola de Futebol', 'Bola oficial para futebol de campo', 79.99,
   ARRAY['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400'],
   (SELECT id FROM categories WHERE slug = 'esportes'), 4.4, 75, 120,
   '00000000-0000-0000-0000-000000000001'),

  ('Kit Yoga', 'Kit completo para prática de yoga em casa', 149.99,
   ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'],
   (SELECT id FROM categories WHERE slug = 'esportes'), 4.7, 110, 55,
   '00000000-0000-0000-0000-000000000001');
```

## 📋 Status Atual da Integração Supabase

✅ **Configurações Completas:**
- Variáveis de ambiente (.env.local)
- Cliente Supabase configurado
- Tipos TypeScript definidos
- Context de autenticação criado
- Hook useProducts criado
- Componente SupabaseProductGrid implementado
- Página de login funcional
- Header com navegação de usuário

⏳ **Pendente (requer SQL acima):**
- Criação das tabelas no banco
- Inserção de dados de exemplo

## 🚀 Próximos Passos Após SQL

1. Execute os SQLs acima no Supabase
2. Teste http://localhost:3000/marketplace - deve mostrar produtos
3. Teste registro/login de usuários
4. Teste carrinho integrado com Supabase

## 🔗 Links Importantes

- Dashboard Supabase: https://nbegwhqnlafwkxcoppyk.supabase.co
- SQL Editor: https://nbegwhqnlafwkxcoppyk.supabase.co/project/nbegwhqnlafwkxcoppyk/sql/new
- Table Editor: https://nbegwhqnlafwkxcoppyk.supabase.co/project/nbegwhqnlafwkxcoppyk/editor