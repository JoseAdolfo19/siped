import { NextRequest, NextResponse } from "next/server"
import * as pptxgen from "pptxgenjs"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { html, title } = (await req.json()) as { html: string; title?: string }
  if (!html) return NextResponse.json({ error: "Falta contenido HTML" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  if (user.credits < 10) return NextResponse.json({ error: "Créditos insuficientes", credits: user.credits, cost: 10 }, { status: 402 })

  try {
    const pptx = new pptxgen.default()
    pptx.defineLayout({ name: "WIDE", width: 10, height: 7.5 })
    pptx.layout = "WIDE"

    const slide1 = pptx.addSlide()
    slide1.background = { color: "7C3AED" }
    slide1.addText(title || "Presentación SIPED", { x: 1, y: 2, w: 8, h: 1.5, fontSize: 36, color: "FFFFFF", bold: true, align: "center" })
    slide1.addText(`Generado por SIPED — ${new Date().toLocaleDateString("es-PE")}`, { x: 1, y: 4, w: 8, h: 0.8, fontSize: 16, color: "DDD6FE", align: "center" })

    const lines = html.replace(/<[^>]*>/g, "\n").split("\n").map(l => l.trim()).filter(l => l)
    let currentSlide = pptx.addSlide()
    currentSlide.background = { color: "FFFFFF" }
    let yPos = 0.5
    let isFirstContent = true

    for (const line of lines) {
      if (line.length < 80 && line === line.toUpperCase()) {
        if (yPos > 5.5 || !isFirstContent) {
          currentSlide = pptx.addSlide()
          currentSlide.background = { color: "FFFFFF" }
          yPos = 0.5
        }
        currentSlide.addText(line, { x: 0.5, y: yPos, w: 9, h: 0.6, fontSize: 22, color: "7C3AED", bold: true })
        yPos += 0.7
        isFirstContent = false
      } else {
        if (yPos > 6) {
          currentSlide = pptx.addSlide()
          currentSlide.background = { color: "FFFFFF" }
          yPos = 0.5
        }
        currentSlide.addText(`• ${line}`, { x: 0.8, y: yPos, w: 8.5, h: 0.4, fontSize: 14, color: "333333" })
        yPos += 0.45
        isFirstContent = false
      }
    }

    const slideEnd = pptx.addSlide()
    slideEnd.background = { color: "7C3AED" }
    slideEnd.addText("¡Gracias!", { x: 1, y: 2.5, w: 8, h: 1.5, fontSize: 40, color: "FFFFFF", bold: true, align: "center" })
    slideEnd.addText("Generado con SIPED — Sistema Inteligente de Planificación Educativa Docente", { x: 1, y: 4.5, w: 8, h: 0.8, fontSize: 14, color: "DDD6FE", align: "center" })

    const buffer = await pptx.write({ outputType: "nodebuffer" })

    await prisma.user.update({ where: { email: session.user.email }, data: { credits: { decrement: 10 } } })

    return new Response(buffer as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="sesion-${Date.now()}.pptx"`,
        "X-Credits-Remaining": String(user.credits - 10),
      },
    })
  } catch (error) {
    console.error("PPTX generation error:", error)
    return NextResponse.json({ error: "Error al generar PPTX" }, { status: 500 })
  }
}
