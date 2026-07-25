import { NextRequest, NextResponse } from "next/server"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function htmlToDocxElements(html: string): Paragraph[] {
  const elements: Paragraph[] = []
  const lines = html.replace(/<[^>]*>/g, "\n").split("\n").map(l => l.trim()).filter(l => l)

  for (const line of lines) {
    if (!line) continue
    const isHeading = line.length < 60 && line === line.toUpperCase()
    if (isHeading) {
      elements.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
          children: [new TextRun({ text: line, bold: true, size: 26, color: "7C3AED" })],
        })
      )
    } else {
      elements.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: line, size: 22 })],
        })
      )
    }
  }
  return elements
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { html, title } = (await req.json()) as { html: string; title?: string }
  if (!html) return NextResponse.json({ error: "Falta contenido HTML" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  if (user.credits < 5) return NextResponse.json({ error: "Créditos insuficientes", credits: user.credits, cost: 5 }, { status: 402 })

  try {
    const doc = new Document({
      title: title || "Sesión de Aprendizaje",
      description: "Generado por SIPED",
      styles: { default: { document: { run: { font: "Calibri", size: 22 } } } },
      sections: [
        {
          children: [
            new Paragraph({
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
              children: [new TextRun({ text: title || "Sesión de Aprendizaje", bold: true, size: 32, color: "7C3AED" })],
            }),
            new Paragraph({
              spacing: { after: 200 },
              children: [new TextRun({ text: `Generado por SIPED — ${new Date().toLocaleDateString("es-PE")}`, italics: true, size: 18, color: "999999" })],
            }),
            ...htmlToDocxElements(html),
            new Paragraph({
              spacing: { before: 400 },
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: "— Documento generado por SIPED —", size: 18, color: "AAAAAA", italics: true })],
            }),
          ],
        },
      ],
    })

    const buf = await Packer.toBuffer(doc)

    await prisma.user.update({ where: { email: session.user.email }, data: { credits: { decrement: 5 } } })

    return new Response(buf as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="sesion-${Date.now()}.docx"`,
        "X-Credits-Remaining": String(user.credits - 5),
      },
    })
  } catch (error) {
    console.error("Word generation error:", error)
    return NextResponse.json({ error: "Error al generar Word" }, { status: 500 })
  }
}
