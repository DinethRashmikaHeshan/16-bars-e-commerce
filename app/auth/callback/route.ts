import { createClient } from '@/lib/supabase/server'
import { createOrUpdateAdminRole } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Get current user and create/update admin role
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      if (user?.email) {
        await createOrUpdateAdminRole(supabase, user.id, user.email)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
