import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Impact from '@/components/Impact'
import Services from '@/components/Services'
import Correios from '@/components/Correios'
import MultiMais from '@/components/MultiMais'
import Partners from '@/components/Partners'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Impact />
      <Services />
      <Correios />
      <MultiMais />
      <Partners />
      <Footer />
    </main>
  )
}