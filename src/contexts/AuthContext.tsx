'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: any) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    
    // Only fetch session after component is mounted (client-side)
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Return loading state during SSR and initial client render
  if (!mounted) {
    return (
      <AuthContext.Provider value={{
        user: null,
        session: null,
        loading: true,
        signUp: async () => ({ error: { message: 'Loading...' } }),
        signIn: async () => ({ error: { message: 'Loading...' } }),
        signOut: async () => {},
      }}>
        {children}
      </AuthContext.Provider>
    )
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      // Validar entrada para evitar caracteres problemáticos
      const cleanEmail = email.trim().toLowerCase()
      const cleanPassword = password.trim()
      
      if (!cleanEmail || !cleanPassword) {
        throw new Error('Email e senha são obrigatórios')
      }
      
      const result = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
        options: {
          data: metadata || {}
        }
      })
      
      return result
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      return {
        error: {
          message: error.message || 'Erro ao criar conta. Tente novamente.'
        }
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // Validar entrada para evitar caracteres problemáticos
      const cleanEmail = email.trim().toLowerCase()
      const cleanPassword = password.trim()
      
      if (!cleanEmail || !cleanPassword) {
        throw new Error('Email e senha são obrigatórios')
      }
      
      const result = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      })
      
      return result
    } catch (error: any) {
      console.error('Erro no login:', error)
      return {
        error: {
          message: error.message || 'Erro ao fazer login. Verifique suas credenciais.'
        }
      }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}