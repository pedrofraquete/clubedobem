import { Package, Mail, Mailbox, CreditCard } from 'lucide-react'

export default function Correios() {
  const services = [
    {
      icon: Package,
      title: 'Envio de Encomendas',
      description: 'PAC, SEDEX e Sedex 10'
    },
    {
      icon: Mail,
      title: 'Cartas e Documentos',
      description: 'Envio rápido e seguro'
    },
    {
      icon: Mailbox,
      title: 'Recebimento',
      description: 'Retire suas encomendas aqui'
    },
    {
      icon: CreditCard,
      title: 'Serviços Bancários',
      description: 'Banco Postal disponível'
    }
  ]

  const benefits = [
    '✓ Sem filas',
    '✓ Atendimento rápido',
    '✓ Perto de casa',
    '✓ Preços oficiais'
  ]

  return (
    <section id="correios" className="py-20 bg-gradient-to-br from-yellow-400 to-orange-500 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            
            {/* Correios Icon */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                <div className="text-6xl">📮</div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                  📮 Serviços dos Correios Aqui!
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Agora você pode realizar todos os serviços postais sem sair da sua comunidade
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service, index) => {
                  const IconComponent = service.icon
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gradient-to-r hover:from-yellow-400 hover:to-orange-500 hover:text-white transition-all duration-300 group"
                    >
                      <IconComponent className="w-8 h-8 text-orange-500 group-hover:text-white flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-white mb-1">
                          {service.title}
                        </h4>
                        <p className="text-sm text-gray-600 group-hover:text-white/90">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-3">
                {benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}