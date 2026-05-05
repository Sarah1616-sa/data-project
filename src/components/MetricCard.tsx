import type { ReactNode } from 'react'

type MetricCardProps = {
  label: string
  value: string
  detail: string
  icon: ReactNode
}

export default function MetricCard({ label, value, detail, icon }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span className="metric-icon">{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  )
}
