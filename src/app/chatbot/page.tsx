import UnifiedHeader from '@/components/UnifiedHeader'
import Footer from '@/components/Footer'

export default function ChatbotPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <UnifiedHeader variant="main" />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Assistente Virtual do Clube do Bem
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Converse com nosso assistente inteligente para tirar dúvidas, conhecer nossos serviços e descobrir como fazer parte da nossa comunidade.
          </p>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <iframe
              src="https://apps.abacus.ai/chatllm/?appId=12c985db22&hideTopBar=2"
              width="100%"
              height="600"
              frameBorder="0"
              className="w-full"
              title="Chatbot do Clube do Bem"
              allow="microphone; camera"
            />
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Nosso assistente está disponível 24/7 para ajudar você. 
              Faça perguntas sobre nossos serviços, impacto social, parcerias e muito mais!
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
