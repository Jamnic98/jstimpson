'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function GateForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/logs-gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (res.ok) {
        router.push(searchParams.get('next') || '/logs/running')
        router.refresh()
      } else {
        setError('Invalid access token')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-xs flex-col gap-3">
      <input
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="access token"
        autoFocus
        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 font-mono text-sm text-neutral-200 outline-none focus:border-orange-600"
      />
      <button
        type="submit"
        disabled={busy || !token}
        className="cursor-pointer rounded-lg bg-orange-600/20 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-orange-500 transition-colors hover:bg-orange-600/30 disabled:opacity-50"
      >
        unlock
      </button>
      {error && <p className="font-mono text-xs text-red-400">{error}</p>}
    </form>
  )
}

export default function LogsGatePage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
        this area is private
      </p>
      <Suspense fallback={null}>
        <GateForm />
      </Suspense>
    </main>
  )
}
