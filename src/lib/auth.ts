import { createClient } from "./supabase/server"
import { prisma } from "./prisma"

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  image?: string | null
  planType: string
  status: string
  credits: number
}

export interface Session {
  user: SessionUser
}

export async function auth(): Promise<Session | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return null

  const dbUser = await prisma.user.findUnique({ where: { email: user.email } })
  if (!dbUser) return null

  return {
    user: {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      image: dbUser.image,
      planType: dbUser.planType,
      status: dbUser.status,
      credits: dbUser.credits,
    },
  }
}

export async function signIn() { throw new Error("Usa supabase.auth.signInWithPassword") }
export async function signOut() { throw new Error("Usa supabase.auth.signOut en el cliente") }
