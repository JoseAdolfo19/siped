import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      planType: string
      status: string
      credits: number
    }
  }

  interface User {
    planType: string
    status: string
    credits: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    planType: string
    status: string
    credits: number
  }
}
