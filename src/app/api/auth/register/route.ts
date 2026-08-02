import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    if (password.length < 6) return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 })

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name || email.split("@")[0] } },
    })
    if (error || !data.user) return NextResponse.json({ error: error?.message || "Error al registrar en Supabase" }, { status: 500 })

    const user = await prisma.user.create({
      data: { name: name || email.split("@")[0], email, planType: "free", status: "active" },
    })
    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch { return NextResponse.json({ error: "Error al registrar" }, { status: 500 }) }
}
