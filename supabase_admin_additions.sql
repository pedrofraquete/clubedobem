-- ADIÇÕES NECESSÁRIAS AO SCHEMA EXISTENTE
-- Execute este SQL no Editor SQL do Supabase

-- 1. CRIAR TABELA DE EVENTOS (para o sistema administrativo)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  community_id UUID REFERENCES public.communities(id) NOT NULL,
  service_id UUID REFERENCES public.community_services(id) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_capacity INTEGER NOT NULL CHECK (total_capacity > 0),
  slots_per_hour INTEGER NOT NULL CHECK (slots_per_hour > 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'full', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR TABELA DE INSCRIÇÕES EM EVENTOS
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  event_id UUID REFERENCES public.events(id) NOT NULL,
  time_slot TIME NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show')),
  contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, time_slot, user_id) -- Impede inscrição duplicada no mesmo slot
);

-- 3. HABILITAR RLS NAS NOVAS TABELAS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS RLS PARA EVENTOS

-- Eventos são visíveis por todos quando ativos
DROP POLICY IF EXISTS "Events are viewable by everyone when active" ON public.events;
CREATE POLICY "Events are viewable by everyone when active" ON public.events
  FOR SELECT USING (status = 'active');

-- Apenas admins podem gerenciar eventos
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 5. POLÍTICAS RLS PARA INSCRIÇÕES EM EVENTOS

-- Usuários podem ver suas próprias inscrições
DROP POLICY IF EXISTS "Users can view own registrations" ON public.event_registrations;
CREATE POLICY "Users can view own registrations" ON public.event_registrations
  FOR SELECT USING (user_id = auth.uid());

-- Usuários podem criar suas próprias inscrições
DROP POLICY IF EXISTS "Users can create own registrations" ON public.event_registrations;
CREATE POLICY "Users can create own registrations" ON public.event_registrations
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Usuários podem atualizar suas próprias inscrições
DROP POLICY IF EXISTS "Users can update own registrations" ON public.event_registrations;
CREATE POLICY "Users can update own registrations" ON public.event_registrations
  FOR UPDATE USING (user_id = auth.uid());

-- Admins podem ver e gerenciar todas as inscrições
DROP POLICY IF EXISTS "Admins can manage all registrations" ON public.event_registrations;
CREATE POLICY "Admins can manage all registrations" ON public.event_registrations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- 6. TRIGGERS PARA UPDATED_AT
DROP TRIGGER IF EXISTS handle_updated_at_events ON public.events;
CREATE TRIGGER handle_updated_at_events
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_event_registrations ON public.event_registrations;
CREATE TRIGGER handle_updated_at_event_registrations
  BEFORE UPDATE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. FUNÇÃO PARA CRIAR USUÁRIO AUTOMATICAMENTE APÓS CADASTRO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'buyer'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. TRIGGER PARA CRIAR USUÁRIO AUTOMATICAMENTE
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. ATUALIZAR POLÍTICA DOS USUÁRIOS PARA PERMITIR INSERÇÃO AUTOMÁTICA
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Esta política permite que o trigger funcione
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
CREATE POLICY "Enable insert for authenticated users only" ON public.users
  FOR INSERT WITH CHECK (true);

-- 10. INSERIR EVENTOS DE EXEMPLO
INSERT INTO public.events (
  title, 
  description, 
  community_id, 
  service_id, 
  event_date, 
  start_time, 
  end_time, 
  total_capacity, 
  slots_per_hour,
  status
) 
SELECT 
  'Consulta Médica Geral',
  'Consultas médicas com clínico geral para a comunidade. Atendimento preventivo e tratamento de problemas comuns.',
  c.id,
  cs.id,
  '2025-10-10',
  '08:00',
  '12:00',
  20,
  5,
  'active'
FROM public.communities c
JOIN public.community_services cs ON cs.community_id = c.id
WHERE c.slug = 'heliopolis' AND cs.name LIKE '%Consulta%'
LIMIT 1;

INSERT INTO public.events (
  title, 
  description, 
  community_id, 
  service_id, 
  event_date, 
  start_time, 
  end_time, 
  total_capacity, 
  slots_per_hour,
  status
) 
SELECT 
  'Aula de Informática Básica',
  'Curso de informática para iniciantes. Aprenda a usar computador, internet e programas básicos.',
  c.id,
  cs.id,
  '2025-10-15',
  '14:00',
  '17:00',
  15,
  5,
  'active'
FROM public.communities c
JOIN public.community_services cs ON cs.community_id = c.id
WHERE c.slug = 'paraisopolis' AND cs.name LIKE '%Informática%'
LIMIT 1;

-- 11. CRIAR UM USUÁRIO ADMIN PARA TESTE (OPCIONAL)
-- IMPORTANTE: Execute apenas se quiser um usuário admin de teste
-- Este usuário pode fazer login com: admin@teste.com / admin123

-- Primeiro, cadastre-se normalmente no sistema com admin@teste.com
-- Depois execute este comando para torná-lo admin:

-- UPDATE public.users 
-- SET role = 'admin', full_name = 'Administrador de Teste'
-- WHERE email = 'admin@teste.com';

-- 12. VERIFICAR SE TUDO FOI CRIADO CORRETAMENTE
-- Executar essas queries para validar:

-- SELECT COUNT(*) as total_events FROM public.events;
-- SELECT COUNT(*) as total_communities FROM public.communities;
-- SELECT COUNT(*) as total_services FROM public.community_services;
-- SELECT email, role FROM public.users;