import type { ReactNode } from 'react'

export function DisclosureBar({ children }: { children: ReactNode }) {
  return (
    <aside className="disclosure-bar">
      <span aria-hidden="true">i</span>
      <p>{children}</p>
    </aside>
  )
}
