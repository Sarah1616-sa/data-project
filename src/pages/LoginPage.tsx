import { useState } from 'react'
import { ArrowRight, ShieldCheck, ShoppingBag, Store } from 'lucide-react'
import type { Role } from '../App'

type LoginPageProps = {
  onSignIn: (role: Role) => void
}

const roleOptions: Array<{
  id: Role
  label: string
  description: string
  icon: typeof ShoppingBag
}> = [
  {
    id: 'customer',
    label: 'Customer',
    description: 'Orders, products, reviews',
    icon: ShoppingBag,
  },
  {
    id: 'storeOwner',
    label: 'Store Owner',
    description: 'Stores, inventory, reports',
    icon: Store,
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Reports, sessions, logs',
    icon: ShieldCheck,
  },
]

export default function LoginPage({ onSignIn }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<Role>('customer')

  return (
    <main className="login-page">
      <section className="login-shell" aria-labelledby="login-title">
        <div className="login-panel">
          <div className="brand-lockup login-brand">
            <span className="brand-mark">EC</span>
            <div>
              <strong>E-Commerce</strong>
              <span>Front-End Prototype</span>
            </div>
          </div>

          <div className="login-heading">
            <p>Role Workspace</p>
            <h1 id="login-title">Sign In</h1>
          </div>

          <form
            className="login-form"
            onSubmit={(event) => {
              event.preventDefault()
              onSignIn(selectedRole)
            }}
          >
            <label className="field" htmlFor="username">
              <span>Username</span>
              <input id="username" name="username" type="text" autoComplete="username" />
            </label>

            <label className="field" htmlFor="password">
              <span>Password</span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
              />
            </label>

            <div className="role-picker" aria-label="Role">
              {roleOptions.map((option) => {
                const Icon = option.icon

                return (
                  <button
                    aria-pressed={selectedRole === option.id}
                    className="role-option"
                    data-active={selectedRole === option.id}
                    key={option.id}
                    onClick={() => setSelectedRole(option.id)}
                    type="button"
                  >
                    <Icon aria-hidden="true" size={20} />
                    <span>{option.label}</span>
                    <small>{option.description}</small>
                  </button>
                )
              })}
            </div>

            <button className="sign-in-button" type="submit">
              <span>Sign In</span>
              <ArrowRight aria-hidden="true" size={18} />
            </button>
          </form>
        </div>

        <aside className="login-summary" aria-label="Prototype summary">
          <div className="summary-card">
            <span>Today</span>
            <strong>124</strong>
            <p>Orders in review</p>
          </div>
          <div className="summary-card">
            <span>Stores</span>
            <strong>18</strong>
            <p>Active storefronts</p>
          </div>
          <div className="summary-card">
            <span>Reports</span>
            <strong>7</strong>
            <p>Open cases</p>
          </div>
        </aside>
      </section>
    </main>
  )
}
