import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"


export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "PocketHistory",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim()
        const password = credentials?.password

        if (!email || !password) return null

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.passwordHash) return null

        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],

  session: { strategy: "jwt" },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth, create or update user
      if (account?.provider === "google") {
        const email = user?.email?.toLowerCase().trim()
        if (!email) return false

        const existingUser = await prisma.user.findUnique({ where: { email } })
        
        if (!existingUser) {
          await prisma.user.create({
            data: {
              email,
              name: user.name || null,
              passwordHash: null,
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user, account, profile }) {
      // On initial sign in, look up the user
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase().trim() },
        })
        if (dbUser) {
          token.uid = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user && token?.uid) {
        session.user.id = token.uid
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
