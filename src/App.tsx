import { useEffect, useState } from 'react'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import LoginPage from './pages/LoginPage'
import StoreOwnerDashboard from './pages/StoreOwnerDashboard'

export type Role = 'customer' | 'storeOwner' | 'admin'

export const roleLabels: Record<Role, string> = {
  customer: 'Customer',
  storeOwner: 'Store Owner',
  admin: 'Admin',
}

const roleRoutes: Record<Role, string> = {
  customer: 'customer',
  storeOwner: 'store-owner',
  admin: 'admin',
}

function readRoleFromHash(): Role | null {
  if (typeof window === 'undefined') {
    return null
  }

  const route = window.location.hash.replace(/^#\/?/, '')
  const match = Object.entries(roleRoutes).find(([, value]) => value === route)

  return match ? (match[0] as Role) : null
}

export default function App() {
  const [activeRole, setActiveRole] = useState<Role | null>(() => readRoleFromHash())

  useEffect(() => {
    const handleHashChange = () => setActiveRole(readRoleFromHash())

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleSignIn = (role: Role) => {
    setActiveRole(role)
    window.location.hash = `/${roleRoutes[role]}`
  }

  const handleSignOut = () => {
    setActiveRole(null)
    window.history.pushState(null, '', window.location.pathname + window.location.search)
  }

  if (activeRole === 'customer') {
    return <CustomerDashboard onSignOut={handleSignOut} />
  }

  if (activeRole === 'storeOwner') {
    return <StoreOwnerDashboard onSignOut={handleSignOut} />
  }

  if (activeRole === 'admin') {
    return <AdminDashboard onSignOut={handleSignOut} />
  }

  return <LoginPage onSignIn={handleSignIn} />
}
