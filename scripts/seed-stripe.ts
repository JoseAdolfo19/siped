import Stripe from "stripe"
import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: path.resolve(__dirname, "../.env") })

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" })

async function main() {
  console.log("🚀 Creando productos y precios en Stripe...\n")

  const weeklyProd = await stripe.products.create({
    name: "Plan Semanal SIPED",
    description: "Acceso completo por 7 días - Planificaciones ilimitadas",
    metadata: { plan_type: "weekly" },
  })
  const weeklyPrice = await stripe.prices.create({
    product: weeklyProd.id, unit_amount: 1000, currency: "pen",
    recurring: { interval: "week" },
  })
  console.log(`✅ Semanal: ${weeklyPrice.id}`)

  const monthlyProd = await stripe.products.create({
    name: "Plan Mensual SIPED",
    description: "Acceso completo por 30 días - Planificaciones ilimitadas",
    metadata: { plan_type: "monthly" },
  })
  const monthlyPrice = await stripe.prices.create({
    product: monthlyProd.id, unit_amount: 3000, currency: "pen",
    recurring: { interval: "month" },
  })
  console.log(`✅ Mensual: ${monthlyPrice.id}\n`)

  console.log("📝 Copia esto a tu .env:")
  console.log(`STRIPE_PRICE_WEEKLY="${weeklyPrice.id}"`)
  console.log(`STRIPE_PRICE_MONTHLY="${monthlyPrice.id}"`)
}

main().catch(console.error)
