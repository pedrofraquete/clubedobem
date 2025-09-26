import { Heart, GraduationCap, Bike, Check } from 'lucide-react'

export default function Services() {
  const services = [
    {
      icon: Heart,
      title: '🏥 Saúde Comunitária',
      description: 'Cuidamos da base com atendimentos essenciais direto nas comunidades',
      items: [
        'Fisioterapia especializada',
        'Apoio psicológico',
        'Enfermagem e cuidados',
        'Assistência social'
      ],
      gradient: 'from-orange-400 via-teal-600 to-blue-400'
    },
    {
      icon: GraduationCap,
      title: '🎓 Educação & Capacitação',
      description: 'Desenvolvemos talentos locais com cursos práticos e oportunidades reais',
      items: [
        'Beleza e estética',
        'Música e cultura',
        'Idiomas e comunicação',
        'Desenvolvimento pessoal'
      ],
      gradient: 'from-blue-400 via-teal-600 to-orange-400'
    },
    {
      icon: Bike,
      title: '🚴 Logística Sustentável',
      description: 'Geramos renda com entregas ecológicas feitas por moradores locais',
      items: [
        'Bicicletas elétricas',
        'Emprego local',
        'Redução de CO2',
        'Conexão eficiente'
      ],
      gradient: 'from-teal-600 to-orange-400'
    }
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
            Ecossistema de Transformação
          </h2>
          <p className="text-xl text-gray-600">
            Soluções integradas que geram autonomia e desenvolvimento sustentável
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${service.gradient} rounded-3xl p-8 text-white hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
            >
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-white/90 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-3">
                {service.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-200 flex-shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}