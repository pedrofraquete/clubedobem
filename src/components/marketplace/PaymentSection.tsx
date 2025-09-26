import { CreditCard, Smartphone, FileText } from 'lucide-react'

export default function PaymentSection() {
  const paymentMethods = [
    { icon: CreditCard, label: 'Cartão' },
    { icon: Smartphone, label: 'PIX' },
    { icon: FileText, label: 'Boleto' }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Pagamento Seguro e Transparente</h2>
        <p className="text-xl mb-8">Powered by Pagar.me - Split automático de pagamentos</p>
        
        <div className="flex justify-center gap-6 mb-8">
          {paymentMethods.map((method, index) => {
            const IconComponent = method.icon
            return (
              <div key={index} className="bg-white text-gray-800 px-6 py-4 rounded-xl flex items-center gap-3 font-semibold">
                <IconComponent className="w-6 h-6" />
                <span>{method.label}</span>
              </div>
            )
          })}
        </div>

        <div className="text-sm opacity-90 space-y-1">
          <p>✓ Repasse automático aos vendedores</p>
          <p>✓ Comissão social transparente</p>
          <p>✓ Proteção ao comprador</p>
        </div>
      </div>
    </section>
  )
}