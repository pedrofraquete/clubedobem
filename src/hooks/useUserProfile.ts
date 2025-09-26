import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { User } from '@/types/database.types'

export function useUserProfile() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    if (!authUser) {
      setProfile(null)
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (error) {
          // If profile doesn't exist, create it
          if (error.code === 'PGRST116') {
            await createUserProfile()
          } else {
            setError(error.message)
          }
        } else {
          setProfile(data)
        }
      } catch (err) {
        setError('Erro ao carregar perfil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [authUser])

  const createUserProfile = async () => {
    if (!authUser) return

    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
          role: 'buyer'
        })
        .select()
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError('Erro ao criar perfil')
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!authUser || !profile) return

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authUser.id)
        .select()
        .single()

      if (error) {
        setError(error.message)
      } else {
        setProfile(data)
      }
    } catch (err) {
      setError('Erro ao atualizar perfil')
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile: createUserProfile
  }
}