import type { ReactNode } from 'react'

export function DisclosureBar({ children }: { children: ReactNode }) {
  return (
    <aside className="disclosure-bar">
      <span className="disclosure-bar__icon" aria-hidden="true">i</span>
      <p>{children}</p>
    </aside>
  )
}
