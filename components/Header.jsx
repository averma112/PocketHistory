'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-sm font-bold">
          PH
        </div>
        <div>
          <h1 className="text-lg font-semibold">PocketHistory</h1>
          <div className="text-xs text-white/60">
            Personal finance & habit dashboard
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <div className="text-sm text-white/70">
              {session.user?.name || session.user?.email}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white transition hover:bg-emerald-700"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  )
}
