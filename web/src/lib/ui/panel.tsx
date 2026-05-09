import type { ElementType, ReactNode } from 'react'

type PanelProps = {
  as?: ElementType
  className?: string
  children: ReactNode
}

export function Panel({
  as: Component = 'section',
  className = '',
  children,
}: PanelProps) {
  return (
    <Component
      className={`rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20 ${className}`.trim()}
    >
      {children}
    </Component>
  )
}
