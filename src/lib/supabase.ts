import { createBrowserClient, createServerClient } from '@supabase/ssr'

// Função para validar e limpar variáveis de ambiente
function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue
  if (!value) {
    console.warn(`Variável de ambiente ${name} não encontrada, usando valor padrão`)
    return defaultValue || ''
  }
  
  return value.trim()
}

// Get environment variables directly for Next.js client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvY2FsaG9zdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE5NTY1NzEyMDB9.test'

console.log('Supabase config:', { url: supabaseUrl, keyLength: supabaseAnonKey?.length || 0 })

// Client-side Supabase client
export function createClient() {
  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  } catch (error) {
    console.error('Erro ao criar cliente Supabase:', error)
    throw new Error('Falha na configuração do Supabase. Verifique as variáveis de ambiente.')
  }
}

// Server-side Supabase client for server actions
export function createServerSupabaseClient(cookieStore: any) {
  try {
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This can be ignored if you have middleware refreshing
            // user sessions
            console.warn('Erro ao definir cookie:', error)
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // This can be ignored if you have middleware refreshing
            // user sessions
            console.warn('Erro ao remover cookie:', error)
          }
        }
      },
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  } catch (error) {
    console.error('Erro ao criar cliente Supabase server-side:', error)
    throw new Error('Falha na configuração do Supabase server-side.')
  }
}