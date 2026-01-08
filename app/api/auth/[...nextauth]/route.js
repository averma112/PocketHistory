import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),

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
    async jwt({ token, user }) {
      if (user?.id) token.uid = user.id
      return token
    },
    async session({ session, token }) {
      if (session?.user && token?.uid) session.user.id = token.uid
      return session
    },
  },
})

export { handler as GET, handler as POST }
