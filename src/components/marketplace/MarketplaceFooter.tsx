import { Mail, Phone, MapPin } from 'lucide-react'

export default function MarketplaceFooter() {
  const footerSections = [
    {
      title: 'Para Compradores',
      links: ['Como Comprar', 'Garantia de Entrega', 'Política de Devolução', 'Central de Ajuda']
    },
    {
      title: 'Para Vendedores',
      links: ['Como Vender', 'Taxas e Comissões', 'Repasse de Valores', 'Suporte ao Vendedor']
    },
    {
      title: 'Impacto Social',
      links: ['Projetos Apoiados', 'Relatório de Impacto', 'Transparência', 'Seja um Parceiro']
    }
  ]

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Marketplace do Bem</h3>
            <p className="text-gray-300 leading-relaxed">
              Transformando comunidades através do comércio consciente e solidário.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Mail className="w-4 h-4" />
                <span>marketplace@clubedobembrasil.com.br</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Phone className="w-4 h-4" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>São Paulo, Brasil</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-400">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Border */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 Marketplace do Bem - Clube do Bem Brasil. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}