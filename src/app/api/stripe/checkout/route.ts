import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getCurrentUser } from "@/lib/permissions"

const PRICE_IDS: Record<string, string> = { weekly: process.env.STRIPE_PRICE_WEEKLY!, monthly: process.env.STRIPE_PRICE_MONTHLY! }
const PLAN_PRICES: Record<string, { amount: number; label: string }> = { weekly: { amount: 1000, label: "Semanal" }, monthly: { amount: 3000, label: "Mensual" } }

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    const { planType } = await req.json()
    if (!["weekly", "monthly"].includes(planType)) return NextResponse.json({ error: "Plan no válido" }, { status: 400 })
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const priceId = PRICE_IDS[planType]

    if (priceId) {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription", payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: user.email || undefined, client_reference_id: user.id,
        metadata: { planType, userId: user.id },
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/cancel`,
      })
      return NextResponse.json({ url: session.url })
    }

    const plan = PLAN_PRICES[planType]
    const session = await stripe.checkout.sessions.create({
      mode: "payment", payment_method_types: ["card"],
      line_items: [{ price_data: { currency: "pen", product_data: { name: `Plan ${plan.label} SIPED` }, unit_amount: plan.amount }, quantity: 1 }],
      customer_email: user.email || undefined, client_reference_id: user.id,
      metadata: { planType, userId: user.id },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/cancel`,
    })
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Stripe error:", error)
    return NextResponse.json({ error: error.message || "Error al crear checkout" }, { status: 500 })
  }
}
