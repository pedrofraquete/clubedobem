-- Insert sample products (this should be run after categories are created)
-- First create a sample seller user (this will be inserted when a user signs up)

-- Get category IDs for reference (replace these UUIDs with actual ones from your categories table)
-- You can get these by running: SELECT id, name FROM categories;

-- Sample products for Eletrônicos
INSERT INTO public.products (name, description, price, images, category_id, rating, rating_count, stock, seller_id) VALUES 
  ('Smartphone Android', 'Smartphone com 128GB de armazenamento, câmera dupla e tela de 6.5"', 899.99, 
   ARRAY['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'], 
   (SELECT id FROM categories WHERE slug = 'eletronicos'), 4.5, 120, 50, 
   '00000000-0000-0000-0000-000000000000'), -- Replace with actual seller UUID

  ('Notebook Gaming', 'Notebook gamer com RTX 3060, 16GB RAM, SSD 512GB', 3499.99,
   ARRAY['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
   (SELECT id FROM categories WHERE slug = 'eletronicos'), 4.8, 85, 25,
   '00000000-0000-0000-0000-000000000000'),

  ('Fones Bluetooth', 'Fones de ouvido sem fio com cancelamento de ruído', 299.99,
   ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
   (SELECT id FROM categories WHERE slug = 'eletronicos'), 4.3, 200, 100,
   '00000000-0000-0000-0000-000000000000');

-- Sample products for Roupas
INSERT INTO public.products (name, description, price, images, category_id, rating, rating_count, stock, seller_id) VALUES 
  ('Camiseta Básica', 'Camiseta 100% algodão, diversas cores disponíveis', 39.99,
   ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
   (SELECT id FROM categories WHERE slug = 'roupas'), 4.2, 150, 200,
   '00000000-0000-0000-0000-000000000000'),

  ('Jeans Premium', 'Calça jeans premium com corte moderno', 159.99,
   ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
   (SELECT id FROM categories WHERE slug = 'roupas'), 4.6, 90, 75,
   '00000000-0000-0000-0000-000000000000'),

  ('Vestido Floral', 'Vestido floral perfeito para o verão', 89.99,
   ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'],
   (SELECT id FROM categories WHERE slug = 'roupas'), 4.4, 65, 40,
   '00000000-0000-0000-0000-000000000000');

-- Sample products for Casa e Decoração
INSERT INTO public.products (name, description, price, images, category_id, rating, rating_count, stock, seller_id) VALUES 
  ('Vaso Decorativo', 'Vaso cerâmico artesanal para plantas', 79.99,
   ARRAY['https://images.unsplash.com/photo-1493663284031-b7e3aab21900?w=400'],
   (SELECT id FROM categories WHERE slug = 'casa-decoracao'), 4.7, 45, 30,
   '00000000-0000-0000-0000-000000000000'),

  ('Kit Almofadas', 'Kit com 4 almofadas decorativas', 149.99,
   ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
   (SELECT id FROM categories WHERE slug = 'casa-decoracao'), 4.1, 35, 20,
   '00000000-0000-0000-0000-000000000000'),

  ('Luminária LED', 'Luminária LED moderna com controle remoto', 199.99,
   ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400'],
   (SELECT id FROM categories WHERE slug = 'casa-decoracao'), 4.5, 80, 45,
   '00000000-0000-0000-0000-000000000000');

-- Sample products for Livros
INSERT INTO public.products (name, description, price, images, category_id, rating, rating_count, stock, seller_id) VALUES 
  ('Romance Nacional', 'Bestseller da literatura brasileira contemporânea', 34.99,
   ARRAY['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
   (SELECT id FROM categories WHERE slug = 'livros'), 4.8, 220, 150,
   '00000000-0000-0000-0000-000000000000'),

  ('Guia de Programação', 'Aprenda programação do zero ao avançado', 89.99,
   ARRAY['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'],
   (SELECT id FROM categories WHERE slug = 'livros'), 4.9, 180, 80,
   '00000000-0000-0000-0000-000000000000'),

  ('Livro de Receitas', '100 receitas práticas para o dia a dia', 49.99,
   ARRAY['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
   (SELECT id FROM categories WHERE slug = 'livros'), 4.3, 95, 60,
   '00000000-0000-0000-0000-000000000000');

-- Sample products for Esportes
INSERT INTO public.products (name, description, price, images, category_id, rating, rating_count, stock, seller_id) VALUES 
  ('Tênis Running', 'Tênis para corrida com amortecimento avançado', 249.99,
   ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
   (SELECT id FROM categories WHERE slug = 'esportes'), 4.6, 140, 90,
   '00000000-0000-0000-0000-000000000000'),

  ('Bola de Futebol', 'Bola oficial para futebol de campo', 79.99,
   ARRAY['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400'],
   (SELECT id FROM categories WHERE slug = 'esportes'), 4.4, 75, 120,
   '00000000-0000-0000-0000-000000000000'),

  ('Kit Yoga', 'Kit completo para prática de yoga em casa', 149.99,
   ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'],
   (SELECT id FROM categories WHERE slug = 'esportes'), 4.7, 110, 55,
   '00000000-0000-0000-0000-000000000000');