export default function MarketplaceHero() {
  return (
    <section className="bg-gradient-to-br from-orange-400 via-teal-600 to-blue-400 text-white py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">
          Marketplace Social que Transforma Comunidades
        </h1>
        <p className="text-xl lg:text-2xl mb-8 text-white/90">
          Compre de empreendedores locais e ajude a gerar impacto social positivo
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-teal-600 px-8 py-4 rounded-full font-semibold hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            Começar a Comprar
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-teal-600 transition-all duration-300">
            Quero Vender
          </button>
        </div>
      </div>
    </section>
  )
}