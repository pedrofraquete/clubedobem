import { Target, Users, Rocket, BarChart3 } from 'lucide-react'

export default function Impact() {
  const impacts = [
    {
      icon: Target,
      title: 'Identificamos',
      description: 'Usamos dados e escuta ativa para mapear necessidades reais das comunidades'
    },
    {
      icon: Users,
      title: 'Mobilizamos',
      description: 'Conectamos recursos, parceiros e tecnologia para resolver desafios com agilidade'
    },
    {
      icon: Rocket,
      title: 'Entregamos',
      description: 'Geramos acesso, renda e inclusão com modelos de impacto contínuo'
    },
    {
      icon: BarChart3,
      title: 'Medimos',
      description: 'Acompanhamos resultados, ajustamos estratégias e escalamos o que funciona'
    }
  ]

  return (
    <section id="impact" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
            Nosso Modelo de Impacto
          </h2>
          <p className="text-xl text-gray-600">
            Uma abordagem integrada que transforma realidades com inteligência, escala e resultado
          </p>
        </div>

        {/* Impact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => {
            const IconComponent = impact.icon
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Gradient top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400"></div>
                
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">{impact.title}</h3>
                <p className="text-gray-600 leading-relaxed">{impact.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}