import NextAuth from "next-auth"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"
import GitHub from "next-auth/providers/github"

// *DO NOT* create a `Pool` here, outside the request handler.

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return {
    // adapter: NeonAdapter(pool),
    providers: [GitHub],
  }
})

// export const { handlers, auth } = NextAuth({
//   providers: [GitHub],
// })

export async function getCurrentUserId(): Promise<number> {
  // e.g. from Clerk / NextAuth / custom cookie session
  // return session.user.id
  return 2;
//   throw new Error("Implement getCurrentUserId()");
}