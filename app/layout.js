'use client'

import './globals.css'
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070B14] text-white antialiased">
        <SessionProvider>
          <main className="max-w-6xl mx-auto p-4 sm:p-6">{children}</main>
        </SessionProvider>
      </body>
    </html>
  )
}
