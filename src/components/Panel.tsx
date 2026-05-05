import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  eyebrow?: string
  children: ReactNode
}

export default function Panel({ title, eyebrow, children }: PanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        {eyebrow ? <span>{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}
