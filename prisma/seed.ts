import { PrismaClient } from "@prisma/client"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"

const prisma = new PrismaClient()

const supabaseAdmin = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const USERS = [
  { email: "admin@siped.com", name: "Admin SIPED", planType: "admin", credits: 999999, subscription: { planType: "admin", isVip: true } },
  { email: "vip@siped.com", name: "Docente VIP", planType: "vip", credits: 999999, subscription: { planType: "vip", isVip: true } },
  { email: "docente@siped.com", name: "Docente Free", planType: "free", credits: 100, subscription: null },
]

async function main() {
  for (const u of USERS) {
    // Crear usuario en Supabase Auth (permite login sin confirmar email)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: u.email,
      password: "admin123",
      email_confirm: true,
      user_metadata: { name: u.name },
    })
    if (error && !error.message.includes("already")) {
      console.error(`❌ Supabase Auth ${u.email}: ${error.message}`)
    } else {
      console.log(`✅ Supabase Auth: ${u.email} (${data?.user ? "creado" : "ya existía"})`)
    }

    // Usuario en la base de la app (Prisma)
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, planType: u.planType, credits: u.credits, status: "active" },
      create: {
        name: u.name,
        email: u.email,
        planType: u.planType,
        status: "active",
        credits: u.credits,
      },
    })

    if (u.subscription) {
      await prisma.subscription.upsert({
        where: { id: `seed-${u.email}` },
        update: { planType: u.subscription.planType, status: "active", isVip: u.subscription.isVip, endDate: new Date("2099-12-31") },
        create: {
          id: `seed-${u.email}`,
          userId: user.id,
          planType: u.subscription.planType,
          status: "active",
          isVip: u.subscription.isVip,
          endDate: new Date("2099-12-31"),
        },
      })
    }
    console.log(`✅ Prisma: ${u.email} (${u.planType})`)
  }

  console.log("\nUsuarios de prueba:")
  console.log("   admin@siped.com / admin123 (Admin)")
  console.log("   vip@siped.com / admin123 (VIP)")
  console.log("   docente@siped.com / admin123 (Free)")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
