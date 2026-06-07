'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      
      if (data?.session) {
        if (data.user?.email) {
          const { createOrUpdateAdminRole } = await import('@/lib/admin')
          await createOrUpdateAdminRole(supabase, data.user.id, data.user.email)
        }
        router.push('/')
        router.refresh()
      } else {
        setError('Sign up successful! Please check your email to confirm your account.')
        setIsLoading(false)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-black">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-amber-600 bg-black text-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src="/logo.png"
                  alt="16 Bars"
                  width={120}
                  height={120}
                  className="h-24 w-auto"
                />
              </div>
              <CardTitle className="text-2xl">Join 16 Bars</CardTitle>
              <CardDescription className="text-amber-200">
                Create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSignUp} className="flex flex-col gap-4">
                {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-amber-600">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-950 border border-amber-600/30 focus:border-amber-600 text-white placeholder-gray-600 rounded outline-none transition"
                    placeholder="name@example.com"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-amber-600">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-950 border border-amber-600/30 focus:border-amber-600 text-white placeholder-gray-600 rounded outline-none transition"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold mt-2"
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-600/25"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-amber-600/60">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-amber-600/50 text-amber-600 hover:bg-amber-600 hover:text-black font-semibold"
                >
                  Sign up with Google
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-600/25"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-amber-600/60">Already a member?</span>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-black"
                >
                  <Link href="/auth/login">Sign in</Link>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
