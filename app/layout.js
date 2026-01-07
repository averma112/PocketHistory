import './globals.css'

export const metadata = {
  title: 'PocketHistory',
  description: 'Track. Reflect. Grow.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070B14] text-white antialiased">
        <main className="max-w-6xl mx-auto p-4 sm:p-6">{children}</main>
      </body>
    </html>
  )
}
