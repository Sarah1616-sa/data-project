import { useEffect, useState } from 'react'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import LoginPage from './pages/LoginPage'
import StoreOwnerDashboard from './pages/StoreOwnerDashboard'

export type Role = 'customer' | 'storeOwner' | 'admin'

export type Store = {
  id: string
  name: string
  city: string
  owner: string
  status: 'Open' | 'Review'
  description: string
}

export type Product = {
  id: string
  name: string
  storeId: string
  storeName: string
  price: number
  units: number
  status: 'Active' | 'Low Stock' | 'Paused'
  description: string
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Ready to ship'
  | 'Out for delivery'
  | 'Delivered'
  | 'Issue'

export type Order = {
  id: string
  customer: string
  productId: string
  productName: string
  storeId: string
  storeName: string
  quantity: number
  total: number
  status: OrderStatus
  date: string
}

export type Review = {
  id: string
  productId: string
  productName: string
  storeId: string
  storeName: string
  customer: string
  rating: number
  comment: string
  date: string
}

export type ReportStatus = 'Open' | 'In Progress' | 'Resolved' | 'Rejected'

export type Report = {
  id: string
  customer: string
  storeId: string
  storeName: string
  issue: string
  status: ReportStatus
  date: string
}

export type AdminLog = {
  id: string
  actor: string
  reportId: string
  action: string
  timestamp: string
}

export type Session = {
  id: string
  userType: string
  username: string
  loginTime: string
  logoutStatus: string
}

export type CustomerProfile = {
  username: string
  email: string
  role: 'Customer'
  phone: string
  address: string
  bio: string
}

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

const initialStores: Store[] = [
  {
    id: 'STR-01',
    name: 'Urban Supply',
    city: 'Riyadh',
    owner: 'Store Owner',
    status: 'Open',
    description: 'Daily essentials, bags, and practical accessories.',
  },
  {
    id: 'STR-02',
    name: 'Home Nest',
    city: 'Jeddah',
    owner: 'Store Owner',
    status: 'Open',
    description: 'Homeware, tabletop products, and small decor.',
  },
]

const initialProducts: Product[] = [
  {
    id: 'PR-1001',
    name: 'Everyday Backpack',
    storeId: 'STR-01',
    storeName: 'Urban Supply',
    price: 74,
    units: 34,
    status: 'Active',
    description: 'A structured daily backpack with padded laptop storage and water-resistant fabric.',
  },
  {
    id: 'PR-1002',
    name: 'Ceramic Mug Set',
    storeId: 'STR-02',
    storeName: 'Home Nest',
    price: 28,
    units: 6,
    status: 'Low Stock',
    description: 'A four-piece glazed ceramic mug set for coffee, tea, and daily kitchen use.',
  },
  {
    id: 'PR-1003',
    name: 'Wireless Desk Lamp',
    storeId: 'STR-01',
    storeName: 'Urban Supply',
    price: 52,
    units: 18,
    status: 'Active',
    description: 'A dimmable LED desk lamp with wireless charging and three light temperatures.',
  },
]

const initialOrders: Order[] = [
  {
    id: 'ORD-2042',
    customer: 'Mona Alharbi',
    productId: 'PR-1001',
    productName: 'Everyday Backpack',
    storeId: 'STR-01',
    storeName: 'Urban Supply',
    quantity: 1,
    total: 74,
    status: 'Out for delivery',
    date: 'May 5, 2026',
  },
  {
    id: 'ORD-2038',
    customer: 'Mona Alharbi',
    productId: 'PR-1002',
    productName: 'Ceramic Mug Set',
    storeId: 'STR-02',
    storeName: 'Home Nest',
    quantity: 2,
    total: 56,
    status: 'Processing',
    date: 'May 4, 2026',
  },
]

const initialReviews: Review[] = [
  {
    id: 'REV-18',
    productId: 'PR-1003',
    productName: 'Wireless Desk Lamp',
    storeId: 'STR-01',
    storeName: 'Urban Supply',
    customer: 'Mona Alharbi',
    rating: 5,
    comment: 'Clean design and the charging pad works well on my desk.',
    date: 'May 2, 2026',
  },
  {
    id: 'REV-17',
    productId: 'PR-1001',
    productName: 'Everyday Backpack',
    storeId: 'STR-01',
    storeName: 'Urban Supply',
    customer: 'Faisal Khan',
    rating: 4,
    comment: 'Good capacity and comfortable straps.',
    date: 'May 1, 2026',
  },
]

const initialReports: Report[] = [
  {
    id: 'RPT-700',
    customer: 'Mona Alharbi',
    storeId: 'STR-02',
    storeName: 'Home Nest',
    issue: 'Delivery status has not changed for two days.',
    status: 'Open',
    date: 'May 5, 2026',
  },
  {
    id: 'RPT-693',
    customer: 'Mona Alharbi',
    storeId: 'STR-01',
    storeName: 'Urban Supply',
    issue: 'Refund confirmation needed for a returned item.',
    status: 'Resolved',
    date: 'May 2, 2026',
  },
]

const initialAdminLogs: AdminLog[] = [
  {
    id: 'LOG-502',
    actor: 'Admin User',
    reportId: 'RPT-693',
    action: 'Marked report as Resolved',
    timestamp: 'May 2, 2026 10:42',
  },
  {
    id: 'LOG-501',
    actor: 'Admin User',
    reportId: 'RPT-700',
    action: 'Opened report queue',
    timestamp: 'May 5, 2026 09:21',
  },
]

const initialSessions: Session[] = [
  {
    id: 'SES-91',
    userType: 'Customer',
    username: 'mona@example.com',
    loginTime: 'May 6, 2026 08:44',
    logoutStatus: 'Active',
  },
  {
    id: 'SES-88',
    userType: 'Store Owner',
    username: 'owner@example.com',
    loginTime: 'May 6, 2026 08:12',
    logoutStatus: 'Active',
  },
  {
    id: 'SES-84',
    userType: 'Admin',
    username: 'admin@example.com',
    loginTime: 'May 6, 2026 07:55',
    logoutStatus: 'Logged out at 09:18',
  },
]

const initialProfile: CustomerProfile = {
  username: 'Mona Alharbi',
  email: 'mona@example.com',
  role: 'Customer',
  phone: '+966 55 123 4567',
  address: 'Riyadh, Olaya District',
  bio: 'Frequent customer interested in office tools, accessories, and home products.',
}

function readRoleFromHash(): Role | null {
  if (typeof window === 'undefined') {
    return null
  }

  const route = window.location.hash.replace(/^#\/?/, '')
  const match = Object.entries(roleRoutes).find(([, value]) => value === route)

  return match ? (match[0] as Role) : null
}

function updateProductStatus(units: number): Product['status'] {
  if (units <= 0) {
    return 'Paused'
  }

  if (units <= 6) {
    return 'Low Stock'
  }

  return 'Active'
}

export default function App() {
  const [activeRole, setActiveRole] = useState<Role | null>(() => readRoleFromHash())
  const [stores, setStores] = useState<Store[]>(initialStores)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>(initialAdminLogs)
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(initialProfile)

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

  const handlePlaceOrder = (productId: string, quantity: number) => {
    const product = products.find((item) => item.id === productId)

    if (!product || product.units <= 0) {
      return
    }

    const orderQuantity = Math.max(1, Math.min(quantity, product.units))

    setOrders((currentOrders) => [
      {
        id: `ORD-${2100 + currentOrders.length + 1}`,
        customer: customerProfile.username,
        productId: product.id,
        productName: product.name,
        storeId: product.storeId,
        storeName: product.storeName,
        quantity: orderQuantity,
        total: product.price * orderQuantity,
        status: 'Pending',
        date: 'May 6, 2026',
      },
      ...currentOrders,
    ])

    setProducts((currentProducts) =>
      currentProducts.map((item) => {
        if (item.id !== productId) {
          return item
        }

        const units = Math.max(0, item.units - orderQuantity)

        return {
          ...item,
          units,
          status: updateProductStatus(units),
        }
      }),
    )
  }

  const handleSubmitReview = (productId: string, rating: number, comment: string) => {
    const product = products.find((item) => item.id === productId)

    if (!product || !comment.trim()) {
      return
    }

    setReviews((currentReviews) => [
      {
        id: `REV-${currentReviews.length + 21}`,
        productId: product.id,
        productName: product.name,
        storeId: product.storeId,
        storeName: product.storeName,
        customer: customerProfile.username,
        rating,
        comment: comment.trim(),
        date: 'May 6, 2026',
      },
      ...currentReviews,
    ])
  }

  const handleSubmitReport = (storeId: string, issue: string) => {
    const store = stores.find((item) => item.id === storeId)

    if (!store || !issue.trim()) {
      return
    }

    setReports((currentReports) => [
      {
        id: `RPT-${701 + currentReports.length}`,
        customer: customerProfile.username,
        storeId: store.id,
        storeName: store.name,
        issue: issue.trim(),
        status: 'Open',
        date: 'May 6, 2026',
      },
      ...currentReports,
    ])
  }

  const handleAddStore = (input: { name: string; city: string; description: string }) => {
    if (!input.name.trim()) {
      return
    }

    setStores((currentStores) => [
      ...currentStores,
      {
        id: `STR-${String(currentStores.length + 1).padStart(2, '0')}`,
        name: input.name.trim(),
        city: input.city.trim() || 'Riyadh',
        owner: 'Store Owner',
        status: 'Open',
        description: input.description.trim() || 'New storefront ready for product listings.',
      },
    ])
  }

  const handleAddProduct = (input: {
    name: string
    storeId: string
    price: number
    units: number
    status: Product['status']
    description: string
  }) => {
    const store = stores.find((item) => item.id === input.storeId)

    if (!store || !input.name.trim()) {
      return
    }

    setProducts((currentProducts) => [
      ...currentProducts,
      {
        id: `PR-${1001 + currentProducts.length}`,
        name: input.name.trim(),
        storeId: store.id,
        storeName: store.name,
        price: Math.max(0, input.price),
        units: Math.max(0, input.units),
        status: input.status,
        description: input.description.trim() || 'Product details are ready for customer review.',
      },
    ])
  }

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    )
  }

  const handleUpdateReportStatus = (reportId: string, status: ReportStatus, note: string) => {
    const report = reports.find((item) => item.id === reportId)

    setReports((currentReports) =>
      currentReports.map((item) => (item.id === reportId ? { ...item, status } : item)),
    )

    if (report) {
      setAdminLogs((currentLogs) => [
        {
          id: `LOG-${503 + currentLogs.length}`,
          actor: 'Admin User',
          reportId,
          action: `${note.trim() || 'Updated report'}: ${status}`,
          timestamp: 'May 6, 2026 11:30',
        },
        ...currentLogs,
      ])
    }
  }

  if (activeRole === 'customer') {
    return (
      <CustomerDashboard
        onPlaceOrder={handlePlaceOrder}
        onSaveProfile={setCustomerProfile}
        onSignOut={handleSignOut}
        onSubmitReport={handleSubmitReport}
        onSubmitReview={handleSubmitReview}
        orders={orders.filter((order) => order.customer === customerProfile.username)}
        products={products}
        profile={customerProfile}
        reports={reports.filter((report) => report.customer === customerProfile.username)}
        reviews={reviews.filter((review) => review.customer === customerProfile.username)}
        stores={stores}
        allReviews={reviews}
      />
    )
  }

  if (activeRole === 'storeOwner') {
    const ownerStoreIds = stores.map((store) => store.id)

    return (
      <StoreOwnerDashboard
        onAddProduct={handleAddProduct}
        onAddStore={handleAddStore}
        onSignOut={handleSignOut}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        orders={orders.filter((order) => ownerStoreIds.includes(order.storeId))}
        products={products.filter((product) => ownerStoreIds.includes(product.storeId))}
        reports={reports.filter((report) => ownerStoreIds.includes(report.storeId))}
        reviews={reviews.filter((review) => ownerStoreIds.includes(review.storeId))}
        stores={stores}
      />
    )
  }

  if (activeRole === 'admin') {
    return (
      <AdminDashboard
        adminLogs={adminLogs}
        onSignOut={handleSignOut}
        onUpdateReportStatus={handleUpdateReportStatus}
        reports={reports}
        sessions={initialSessions}
      />
    )
  }

  return <LoginPage onSignIn={handleSignIn} />
}
