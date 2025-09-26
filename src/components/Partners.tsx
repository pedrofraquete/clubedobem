'use client'

export default function Partners() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="partners" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
            Seja um Parceiro de Transformação
          </h2>
          <p className="text-xl text-gray-600">
            Conecte sua marca a projetos que geram impacto real e mensurável
          </p>
        </div>

        {/* CTA Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-400 via-teal-600 to-blue-400 rounded-3xl p-8 lg:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl lg:text-5xl font-bold">
                Juntos, vamos mais longe
              </h2>
              <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Oferecemos rastreabilidade completa, propósito alinhado e resultados que transformam vidas
              </p>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-white text-teal-600 px-8 py-4 rounded-full font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 inline-block"
              >
                Vamos Conversar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}