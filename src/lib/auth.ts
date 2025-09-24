import { NextAuthOptions } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { db } from './db'

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
}
