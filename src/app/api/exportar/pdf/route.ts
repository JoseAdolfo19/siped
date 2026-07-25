import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { html } = (await req.json()) as { html: string }
  if (!html) return NextResponse.json({ error: "Falta contenido HTML" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  if (user.credits < 5) return NextResponse.json({ error: "Créditos insuficientes", credits: user.credits, cost: 5 }, { status: 402 })

  try {
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] })
    const page = await browser.newPage()
    await page.setContent(html)
    const pdf = await page.pdf({ format: "A4", margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }, printBackground: true })
    await browser.close()

    await prisma.user.update({ where: { email: session.user.email }, data: { credits: { decrement: 5 } } })

    return new Response(pdf as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="sesion-${Date.now()}.pdf"`,
        "X-Credits-Remaining": String(user.credits - 5),
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Error al generar PDF" }, { status: 500 })
  }
}
