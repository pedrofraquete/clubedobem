import { CreditCard, ShoppingCart, Smartphone, DollarSign } from 'lucide-react'

export default function MultiMais() {
  const features = [
    {
      icon: CreditCard,
      title: '💳 Serviços Financeiros',
      description: 'Acesso a crédito justo'
    },
    {
      icon: ShoppingCart,
      title: '🛒 Marketplace Local',
      description: 'Fortalece o comércio'
    },
    {
      icon: Smartphone,
      title: '📱 Inclusão Digital',
      description: 'Conecta comunidades'
    },
    {
      icon: DollarSign,
      title: '💰 Circulação de Renda',
      description: 'Economia local forte'
    }
  ]

  return (
    <section id="multimais" className="py-20 bg-gradient-to-br from-blue-400 via-teal-600 to-orange-400 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                MultiMais: Tecnologia para Inclusão
              </h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Nossa plataforma digital conecta moradores a produtos, serviços e soluções financeiras com preço justo e logística local.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 hover:transform hover:translate-x-2 transition-all duration-300"
                  >
                    <IconComponent className="w-8 h-8 text-blue-200 mb-3" />
                    <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Visual Element */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Animated infinity symbol */}
              <svg viewBox="0 0 200 100" className="w-full h-auto max-w-md">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Multiple infinity paths with different colors and animations */}
                <path 
                  d="M 50 50 C 50 20, 20 20, 20 50 C 20 80, 50 80, 50 50 C 50 20, 80 20, 80 50 C 80 80, 50 80, 50 50" 
                  fill="none" 
                  stroke="#F5A623" 
                  strokeWidth="4" 
                  opacity="0.8" 
                  filter="url(#glow)"
                  className="animate-pulse"
                />
                <path 
                  d="M 100 50 C 100 20, 70 20, 70 50 C 70 80, 100 80, 100 50 C 100 20, 130 20, 130 50  C 130 80, 100 80, 100 50" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="4" 
                  opacity="0.6" 
                  filter="url(#glow)"
                  className="animate-pulse animation-delay-500"
                />
                <path 
                  d="M 150 50 C 150 20, 120 20, 120 50 C 120 80, 150 80, 150 50 C 150 20, 180 20, 180 50 C 180 80, 150 80, 150 50" 
                  fill="none" 
                  stroke="#29B6F6" 
                  strokeWidth="4" 
                  opacity="0.8" 
                  filter="url(#glow)"
                  className="animate-pulse animation-delay-1000"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}