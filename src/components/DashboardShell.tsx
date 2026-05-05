import type { ReactNode } from 'react'
import {
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRound,
} from 'lucide-react'
import type { Role } from '../App'
import { roleLabels } from '../App'

export type NavigationItem = {
  id: string
  label: string
}

const roleIcons = {
  customer: ShoppingBag,
  storeOwner: Store,
  admin: ShieldCheck,
}

const navIcons = [LayoutDashboard, Package, ClipboardList, BarChart3, UserRound]

type DashboardShellProps = {
  role: Role
  title: string
  subtitle: string
  navigation: NavigationItem[]
  activeItem: string
  children: ReactNode
  onNavigate: (item: string) => void
  onSignOut: () => void
}

export default function DashboardShell({
  role,
  title,
  subtitle,
  navigation,
  activeItem,
  children,
  onNavigate,
  onSignOut,
}: DashboardShellProps) {
  const RoleIcon = roleIcons[role]

  return (
    <main className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <span className="brand-mark">EC</span>
          <div>
            <strong>E-Commerce</strong>
            <span>Prototype</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label={`${roleLabels[role]} navigation`}>
          {navigation.map((item, index) => {
            const Icon = navIcons[index % navIcons.length]
            const isActive = activeItem === item.id

            return (
              <button
                aria-current={isActive ? 'page' : undefined}
                className="nav-item"
                data-active={isActive}
                onClick={() => onNavigate(item.id)}
                type="button"
                key={item.id}
              >
                <Icon aria-hidden="true" size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-title-group">
            <span className="role-icon">
              <RoleIcon aria-hidden="true" size={22} />
            </span>
            <div>
              <p>{roleLabels[role]}</p>
              <h1>{title}</h1>
              <span>{subtitle}</span>
            </div>
          </div>

          <div className="topbar-actions">
            <span className="role-pill">{roleLabels[role]}</span>
            <button className="logout-button" type="button" onClick={onSignOut}>
              <LogOut aria-hidden="true" size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <div className="dashboard-content">{children}</div>
      </section>
    </main>
  )
}
