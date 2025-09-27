'use client'

import { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get redirect parameters
  const redirectTo = searchParams?.get('redirect') || '/marketplace'
  const selectedDate = searchParams?.get('date')
  const selectedTime = searchParams?.get('time')

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // If there are booking parameters, redirect back to booking with them
      if (redirectTo && selectedDate && selectedTime) {
        router.push(`${redirectTo}?date=${selectedDate}&time=${selectedTime}`)
      } else {
        router.push(redirectTo)
      }
    }
  }, [user, router, redirectTo, selectedDate, selectedTime])

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = isSignUp 
        ? await signUp(email, password, { full_name: email.split('@')[0] })
        : await signIn(email, password)
      
      if (result.error) {
        setError(result.error.message)
      } else if (result.data.user && !isSignUp) {
        // Redirect will happen via useEffect
      } else if (isSignUp) {
        setError('Verifique seu email para confirmar a conta!')
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="email-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha * (mínimo 6 caracteres)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                data-testid="password-input"
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
                setIsSignUp(!isSignUp)
                setError('')
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
