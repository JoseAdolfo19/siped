import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { CREDIT_COSTS } from "@/lib/credits"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const systemPrompt = `Eres un asistente experto en el sistema educativo peruano (MINEDU). 
Generas planes de sesión de aprendizaje para docentes en formato JSON.
Debes incluir: competencies, capacities, performance, purpose, evidence, 
transversalApproaches, seqInicio, seqDesarrollo, seqCierre, 
gestionAprendizaje, seqDurante, seqDespues, evaluationTechniques, 
evaluationInstruments, resources, reflections.
Responde ÚNICAMENTE con el JSON, sin markdown ni explicaciones.`

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  const { nivel, area, titulo, grado } = (await req.json()) as { nivel: string; area: string; titulo: string; grado: string }
  if (!titulo || !area) return NextResponse.json({ error: "Título y asignatura requeridos" }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  if (user.credits < CREDIT_COSTS.AUTO_FILL) {
    return NextResponse.json({ error: "Créditos insuficientes", credits: user.credits, cost: CREDIT_COSTS.AUTO_FILL }, { status: 402 })
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY
  const baseURL = process.env.DEEPSEEK_API_KEY
    ? "https://api.deepseek.com/v1"
    : "https://api.openai.com/v1"

  if (!apiKey) {
    return NextResponse.json({ error: "API de IA no configurada. Configura OPENAI_API_KEY o DEEPSEEK_API_KEY en .env" }, { status: 500 })
  }

  try {
    const openai = new OpenAI({ apiKey, baseURL })
    const prompt = `Nivel: ${nivel}, Área: ${area}, Título: "${titulo}", Grado: ${grado || "No especificado"}. 
Genera un plan completo de sesión de aprendizaje para el nivel ${nivel} peruano (MINEDU).`

    const completion = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content || "{}"
    const cleanJson = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim()
    const data = JSON.parse(cleanJson)

    await prisma.user.update({ where: { email: session.user.email }, data: { credits: { decrement: CREDIT_COSTS.AUTO_FILL } } })

    return NextResponse.json({ success: true, data, credits: user.credits - CREDIT_COSTS.AUTO_FILL })
  } catch (error) {
    console.error("AI autofill error:", error)
    return NextResponse.json({ error: "Error al generar con IA. Verifica tu API key y conexión." }, { status: 500 })
  }
}
