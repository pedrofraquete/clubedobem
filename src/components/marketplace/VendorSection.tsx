export default function VendorSection() {
  const stats = [
    { number: '1.234', label: 'Vendedores Ativos' },
    { number: 'R$ 238k', label: 'Vendas este mês' },
    { number: '15%', label: 'Taxa justa' },
    { number: '48h', label: 'Repasse rápido' }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="border-b-4 border-orange-400 pb-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Área do Vendedor</h2>
          <p className="text-xl text-gray-600">Transforme seu talento em renda e impacto social</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-gradient-to-r from-orange-400 via-teal-600 to-blue-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            Começar a Vender Agora
          </button>
        </div>
      </div>
    </section>
  )
}