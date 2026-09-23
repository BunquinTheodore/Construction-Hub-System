import type { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-gray text-sm text-brand-black">
        Loading…
      </div>
    )
  }

  return <>{children}</>
}
