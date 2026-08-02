"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "./supabase/client"
import type { SessionUser } from "./auth"

interface SessionState {
  data: { user: SessionUser } | null
  status: "loading" | "authenticated" | "unauthenticated"
}

const SessionContext = createContext<SessionState>({ data: null, status: "loading" })

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ data: null, status: "loading" })
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!mounted) return
      if (!user) {
        setState({ data: null, status: "unauthenticated" })
        return
      }
      const res = await fetch("/api/auth/session")
      const json = await res.json()
      if (!mounted) return
      if (json?.user) setState({ data: { user: json.user as SessionUser }, status: "authenticated" })
      else setState({ data: null, status: "unauthenticated" })
    }

    load()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      load()
      router.refresh()
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [router])

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>
}

export function useSession() {
  return useContext(SessionContext)
}

export async function signIn() {
  const supabase = createClient()
  return supabase.auth.signInWithPassword
}

export async function signOut(opts?: { callbackUrl?: string }) {
  const supabase = createClient()
  await supabase.auth.signOut()
  window.location.href = opts?.callbackUrl || "/login"
}
