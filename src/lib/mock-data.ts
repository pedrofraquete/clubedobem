// Mock data for development and testing
export const mockCommunities = [
  {
    id: '1',
    name: 'Paraisópolis',
    slug: 'paraisopolis',
    description: 'Centro Comunitário de Paraisópolis oferecendo serviços essenciais para a comunidade local.',
    address: 'Rua Pasquale Gallupi, 245 - Paraisópolis, São Paulo - SP',
    phone: '(11) 3031-9999',
    email: 'contato@paraisopolis.org.br',
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    operating_hours: {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '18:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_active: true
  },
  {
    id: '2',
    name: 'Heliópolis',
    slug: 'heliopolis',
    description: 'Centro Comunitário de Heliópolis promovendo desenvolvimento social e capacitação profissional.',
    address: 'Rua São João Clímaco, 2167 - Heliópolis, São Paulo - SP',
    phone: '(11) 2274-8888',
    email: 'contato@heliopolis.org.br',
    image_url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800',
    operating_hours: {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '18:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    is_active: true
  }
]

export const mockServices = [
  // Paraisópolis services
  {
    id: 'service-1',
    community_id: '1',
    name: 'Consulta Médica Geral',
    description: 'Atendimento médico básico com clínico geral. Consultas preventivas e tratamento de problemas de saúde comuns.',
    duration_minutes: 30,
    price: 20.00,
    category: 'Saúde',
    requirements: 'Documento com foto e cartão SUS',
    max_participants: 1,
    is_active: true
  },
  {
    id: 'service-2',
    community_id: '1',
    name: 'Aula de Informática Básica',
    description: 'Curso de informática para iniciantes. Aprenda a usar computador, internet e programas básicos.',
    duration_minutes: 90,
    price: 0.00,
    category: 'Educação',
    requirements: 'Idade mínima: 16 anos',
    max_participants: 15,
    is_active: true
  },
  {
    id: 'service-3',
    community_id: '1',
    name: 'Oficina de Costura',
    description: 'Aprenda técnicas de costura e confecção. Desenvolvimento de habilidades para geração de renda.',
    duration_minutes: 120,
    price: 15.00,
    category: 'Capacitação',
    requirements: 'Trazer tecido e linha próprios',
    max_participants: 10,
    is_active: true
  },
  {
    id: 'service-4',
    community_id: '1',
    name: 'Atendimento Jurídico',
    description: 'Orientação jurídica gratuita com advogados voluntários. Direito civil, trabalhista e família.',
    duration_minutes: 45,
    price: 0.00,
    category: 'Jurídico',
    requirements: 'Documentos relacionados ao caso',
    max_participants: 1,
    is_active: true
  },
  {
    id: 'service-5',
    community_id: '1',
    name: 'Curso de Empreendedorismo',
    description: 'Workshop sobre como abrir e gerir um pequeno negócio. Planejamento financeiro e marketing.',
    duration_minutes: 180,
    price: 25.00,
    category: 'Capacitação',
    requirements: 'Idade mínima: 18 anos',
    max_participants: 20,
    is_active: true
  },
  // Heliópolis services
  {
    id: 'service-6',
    community_id: '2',
    name: 'Consulta Odontológica',
    description: 'Atendimento odontológico básico. Limpeza, avaliação e tratamentos preventivos.',
    duration_minutes: 45,
    price: 30.00,
    category: 'Saúde',
    requirements: 'Documento com foto e cartão SUS',
    max_participants: 1,
    is_active: true
  },
  {
    id: 'service-7',
    community_id: '2',
    name: 'Aula de Inglês Básico',
    description: 'Curso de inglês para iniciantes. Focado em conversação e vocabulário do dia a dia.',
    duration_minutes: 60,
    price: 10.00,
    category: 'Educação',
    requirements: 'Material didático incluso',
    max_participants: 12,
    is_active: true
  },
  {
    id: 'service-8',
    community_id: '2',
    name: 'Oficina de Marcenaria',
    description: 'Aprenda técnicas básicas de marcenaria. Construção de móveis simples e reparos.',
    duration_minutes: 150,
    price: 35.00,
    category: 'Capacitação',
    requirements: 'Usar roupas adequadas e sapatos fechados',
    max_participants: 8,
    is_active: true
  },
  {
    id: 'service-9',
    community_id: '2',
    name: 'Atendimento Psicológico',
    description: 'Atendimento psicológico individual. Apoio emocional e orientação terapêutica.',
    duration_minutes: 50,
    price: 0.00,
    category: 'Saúde',
    requirements: 'Agendamento apenas por telefone',
    max_participants: 1,
    is_active: true
  },
  {
    id: 'service-10',
    community_id: '2',
    name: 'Curso de Culinária',
    description: 'Workshop de culinária básica e saudável. Receitas práticas e econômicas.',
    duration_minutes: 120,
    price: 20.00,
    category: 'Capacitação',
    requirements: 'Trazer avental e touca',
    max_participants: 15,
    is_active: true
  }
]

export const generateMockTimeSlots = (serviceId: string, date: string) => {
  // Generate time slots based on service category
  const service = mockServices.find(s => s.id === serviceId)
  if (!service) return []

  const slots = []
  let startHour = 8
  let endHour = 17
  
  if (service.category === 'Saúde') {
    startHour = 8
    endHour = 17
  } else if (service.category === 'Educação') {
    startHour = 14
    endHour = 17
  } else if (service.category === 'Capacitação') {
    startHour = 9
    endHour = 16
  } else if (service.category === 'Jurídico') {
    startHour = 10
    endHour = 16
  }

  for (let hour = startHour; hour < endHour; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00`
    const available = Math.random() > 0.3 // 70% chance of being available
    slots.push({
      time: timeString,
      available,
      booked: available ? Math.floor(Math.random() * (service.max_participants - 1)) : service.max_participants
    })
  }

  return slots
}

export const mockUser = {
  id: 'mock-user-1',
  email: 'usuario@exemplo.com',
  full_name: 'Usuário Teste'
}