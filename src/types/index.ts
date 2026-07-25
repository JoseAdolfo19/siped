import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User { planType?: string; status?: string }
  interface Session {
    user: { id: string; planType: string; status: string } & DefaultSession["user"]
  }
}
export {}
