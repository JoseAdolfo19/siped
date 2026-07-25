import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get("stripe-signature")!
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch { return NextResponse.json({ error: "Invalid signature" }, { status: 400 }) }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const userId = session.client_reference_id || session.metadata?.userId
        const planType = session.metadata?.planType
        if (!userId || !planType) break
        const days = planType === "weekly" ? 7 : 30
        const endDate = new Date(); endDate.setDate(endDate.getDate() + days)
        const existing = await prisma.subscription.findFirst({ where: { userId, status: "active" } })
        if (existing) await prisma.subscription.update({ where: { id: existing.id }, data: { planType, status: "active", startDate: new Date(), endDate } })
        else await prisma.subscription.create({ data: { userId, planType, status: "active", startDate: new Date(), endDate } })
        await prisma.user.update({ where: { id: userId }, data: { planType, status: "active" } })
        console.log(`✅ Usuario ${userId} actualizado a ${planType}`)
        break
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as any
        const userId = sub.metadata?.userId
        if (!userId) break
        const active = sub.status === "active" || sub.status === "trialing"
        await prisma.user.update({ where: { id: userId }, data: { status: active ? "active" : "inactive", planType: active ? (sub.metadata?.planType || "free") : "free" } })
        break
      }
    }
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
