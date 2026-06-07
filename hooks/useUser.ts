'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { createOrUpdateAdminRole, isAdminEmail } from '@/lib/admin'

export interface User {
  id: string
  email: string
  isAdmin: boolean
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser?.email) {
          // Get admin status from user_roles
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('is_admin')
            .eq('user_id', authUser.id)
            .single()

          let isAdmin = roleData?.is_admin || false

          // Auto-heal admin role if whitelisted but not in database yet
          const whitelisted = await isAdminEmail(authUser.email)
          if (whitelisted && !isAdmin) {
            await createOrUpdateAdminRole(supabase, authUser.id, authUser.email)
            isAdmin = true
          }

          setUser({
            id: authUser.id,
            email: authUser.email,
            isAdmin,
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error getting user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('is_admin')
          .eq('user_id', session.user.id)
          .single()

        let isAdmin = roleData?.is_admin || false

        // Auto-heal admin role if whitelisted but not in database yet
        const whitelisted = await isAdminEmail(session.user.email)
        if (whitelisted && !isAdmin) {
          await createOrUpdateAdminRole(supabase, session.user.id, session.user.email)
          isAdmin = true
        }

        setUser({
          id: session.user.id,
          email: session.user.email,
          isAdmin,
        })
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return { user, loading }
}
