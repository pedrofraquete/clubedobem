'use client'

import { useEffect, useState } from 'react'

export default function Hero() {
  const [stats, setStats] = useState({
    lives: 0,
    communities: 0,
    services: 0,
    satisfaction: 0
  })

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const animateCounter = (target: number, key: keyof typeof stats) => {
      let current = 0
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setStats(prev => ({ ...prev, [key]: Math.floor(current) }))
      }, 30)
    }

    const timer = setTimeout(() => {
      animateCounter(50000, 'lives')
      animateCounter(200, 'communities')
      animateCounter(1500000, 'services')
      animateCounter(95, 'satisfaction')
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="home" className="mt-20 min-h-screen bg-gradient-to-br from-orange-400 via-teal-600 to-blue-400 flex items-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Hero Text */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight animate-fade-in-up">
              Transformando Comunidades com Inteligência Social
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 animate-fade-in-up animation-delay-200">
              Conectamos necessidades reais a soluções práticas, gerando impacto mensurável todos os dias nas periferias do Brasil.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-400">
              <button
                onClick={() => scrollToSection('impact')}
                className="bg-white text-teal-600 px-8 py-4 rounded-full font-semibold hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                Conheça Nosso Impacto
              </button>
              <button
                onClick={() => scrollToSection('partners')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all duration-300"
              >
                Seja um Parceiro
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 animate-fade-in-up animation-delay-600">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center text-white">
                <div className="text-3xl lg:text-4xl font-bold">
                  {stats.lives >= 1000 ? `${(stats.lives / 1000).toFixed(0)}K+` : `${stats.lives}+`}
                </div>
                <div className="text-sm lg:text-base opacity-90">Vidas Impactadas</div>
              </div>
              <div className="text-center text-white">
                <div className="text-3xl lg:text-4xl font-bold">{stats.communities}+</div>
                <div className="text-sm lg:text-base opacity-90">Comunidades Atendidas</div>
              </div>
              <div className="text-center text-white">
                <div className="text-3xl lg:text-4xl font-bold">
                  {stats.services >= 1000000 ? `${(stats.services / 1000000).toFixed(1)}M` : `${Math.floor(stats.services / 1000)}K`}
                </div>
                <div className="text-sm lg:text-base opacity-90">Atendimentos Realizados</div>
              </div>
              <div className="text-center text-white">
                <div className="text-3xl lg:text-4xl font-bold">{stats.satisfaction}%</div>
                <div className="text-sm lg:text-base opacity-90">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}