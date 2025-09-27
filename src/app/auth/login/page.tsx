'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { signIn, signUp, user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

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

    const email = emailRef.current?.value || ''
    const password = passwordRef.current?.value || ''

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
        if (emailRef.current) emailRef.current.value = ''
        if (passwordRef.current) passwordRef.current.value = ''
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
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">
            {isSignUp ? 'Criar conta' : 'Entrar'}
          </h1>
          <p className="text-sm text-gray-600 text-center mt-2">
            {isSignUp 
              ? 'Crie sua conta para acessar o sistema' 
              : 'Entre com seu email e senha'}
          </p>
        </div>
        
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              ref={emailRef}
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              data-testid="email-input"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              suppressHydrationWarning
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha * (mínimo 6 caracteres)
            </label>
            <input
              ref={passwordRef}
              id="password"
              type="password"
              placeholder="Sua senha"
              required
              minLength={6}
              data-testid="password-input"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              suppressHydrationWarning
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-600 text-center p-2 bg-red-50 rounded" data-testid="error-message">
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            data-testid="submit-button"
          >
            {loading ? 'Aguarde...' : (isSignUp ? 'Criar conta' : 'Entrar')}
          </button>
        </form>
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={(e) => {
              console.log('Toggle clicked, current isSignUp:', isSignUp)
              setIsSignUp(!isSignUp)
              setError('')
              console.log('Toggle clicked, new isSignUp:', !isSignUp)
            }}
            data-testid="toggle-signup"
            className="text-blue-600 hover:underline text-sm"
          >
            {isSignUp 
              ? 'Já tem conta? Faça login' 
              : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
        
        {isSignUp && (
          <div className="text-center mt-4">
            <p className="text-xs text-gray-600">
              Ao criar sua conta, você poderá acessar agendamentos e outras funcionalidades do sistema.
            </p>
          </div>
        )}
        
        {/* Debug info */}
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs" style={{display: 'block'}}>
          <div>Email: {email}</div>
          <div>Password length: {password.length}</div>
          <div>IsSignUp: {isSignUp ? 'true' : 'false'}</div>
          <div>Loading: {loading ? 'true' : 'false'}</div>
          <div>Mounted: {mounted ? 'true' : 'false'}</div>
        </div>
      </div>
    </div>
  )
}
