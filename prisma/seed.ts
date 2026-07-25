import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("admin123", 10)

  await prisma.user.upsert({
    where: { email: "admin@siped.com" },
    update: {},
    create: {
      name: "Admin SIPED",
      email: "admin@siped.com",
      password,
      planType: "admin",
      status: "active",
      credits: 999999,
      subscriptions: {
        create: {
          planType: "admin",
          status: "active",
          isVip: true,
          endDate: new Date("2099-12-31"),
        },
      },
    },
  })

  await prisma.user.upsert({
    where: { email: "vip@siped.com" },
    update: {},
    create: {
      name: "Docente VIP",
      email: "vip@siped.com",
      password,
      planType: "vip",
      status: "active",
      credits: 999999,
      subscriptions: {
        create: {
          planType: "vip",
          status: "active",
          isVip: true,
          endDate: new Date("2099-12-31"),
        },
      },
    },
  })

  await prisma.user.upsert({
    where: { email: "docente@siped.com" },
    update: {},
    create: {
      name: "Docente Free",
      email: "docente@siped.com",
      password,
      planType: "free",
      status: "active",
      credits: 100,
    },
  })

  console.log("✅ Usuarios creados:")
  console.log("   admin@siped.com / admin123 (Admin)")
  console.log("   vip@siped.com / admin123 (VIP)")
  console.log("   docente@siped.com / admin123 (Free)")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
