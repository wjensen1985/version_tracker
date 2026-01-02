// import NextAuth from "next-auth"
// import NeonAdapter from "@auth/neon-adapter"
// import { Pool } from "@neondatabase/serverless"
// import GitHub from "next-auth/providers/github"

// // *DO NOT* create a `Pool` here, outside the request handler.

// export const { handlers, auth, signIn, signOut } = NextAuth(() => {
//   // Create a `Pool` inside the request handler.
//   const pool = new Pool({ connectionString: process.env.DATABASE_URL })
//   return {
//     // adapter: NeonAdapter(pool),
//     providers: [GitHub],
//   }
// })

// export const { handlers, auth } = NextAuth({
//   providers: [GitHub],
// })

import { neonAuth } from "@neondatabase/auth/next/server";
import { sql } from "./db";

export async function getCurrentUserId(): Promise<number> {
  // e.g. from Clerk / NextAuth / custom cookie session
  // return session.user.id
  
  const { session, user } = await neonAuth();
  if ((!session) || (!user)) {
    throw new Error('Not Authenticated');
  }

  const authUserId = user.id;
  // console.log(authUserId)

  // need to add if uuid doesn't exist, then create new entry in this table
  const public_users_rows = await sql`
    SELECT *
    FROM users u
    WHERE u.auth_user_uuid = ${authUserId}
  `

  // console.log(public_users_rows);

  return public_users_rows[0]["id"] as number;
//   throw new Error("Implement getCurrentUserId()");
}