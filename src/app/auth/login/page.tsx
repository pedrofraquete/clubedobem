'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { signIn, signUp, user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Prevent hydration issues by only running effects after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect if already logged in (only after hydration is complete)
  useEffect(() => {
    if (mounted && !authLoading && user) {
      router.push('/marketplace')
    }
  }, [mounted, authLoading, user, router])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Form submitted:', { email, password, isSignUp })

    try {
      const result = isSignUp 
        ? await signUp(email, password, { full_name: email.split('@')[0] })
        : await signIn(email, password)
      
      console.log('Auth result:', result)
      
      if (result.error) {
        setError(result.error.message)
      } else if (result.data?.user && !isSignUp) {
        console.log('Login successful, user:', result.data.user)
        // Redirect will happen via useEffect
      } else if (isSignUp) {
        setError('Conta criada! Você pode fazer login agora.')
        setIsSignUp(false)
        setEmail('')
        setPassword('')
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" suppressHydrationWarning>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isSignUp ? 'Criar conta' : 'Entrar'}
          </CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            {isSignUp 
              ? 'Crie sua conta para acessar o sistema' 
              : 'Entre com seu email e senha'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email *
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="email-input"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                suppressHydrationWarning
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Senha * (mínimo 6 caracteres)
              </label>
              <input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                data-testid="password-input"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                suppressHydrationWarning
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 text-center" data-testid="error-message">{error}</p>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              data-testid="submit-button"
            >
              {loading ? 'Aguarde...' : (isSignUp ? 'Criar conta' : 'Entrar')}
            </Button>
          </form>
          
          <div className="text-center">
            <Button
              variant="link"
              onClick={() => {
                console.log('Toggle clicked, current isSignUp:', isSignUp)
                setIsSignUp(!isSignUp)
                setError('')
                console.log('Toggle clicked, new isSignUp:', !isSignUp)
              }}
              data-testid="toggle-signup"
            >
              {isSignUp 
                ? 'Já tem conta? Faça login' 
                : 'Não tem conta? Cadastre-se'}
            </Button>
          </div>
          
          {isSignUp && (
            <div className="text-center">
              <p className="text-xs text-gray-600">
                Ao criar sua conta, você poderá acessar agendamentos e outras funcionalidades do sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
