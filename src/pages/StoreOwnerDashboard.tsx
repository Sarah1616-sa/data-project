import { useState, type ReactNode } from 'react'
import { BarChart3, Boxes, ClipboardList, Plus, Star, Store } from 'lucide-react'
import type { Order, OrderStatus, Product, Report, Review, Store as StoreType } from '../App'
import DashboardShell from '../components/DashboardShell'
import { DataTable, StatusPill } from '../components/DataTable'
import MetricCard from '../components/MetricCard'
import Panel from '../components/Panel'

type StoreOwnerDashboardProps = {
  orders: Order[]
  products: Product[]
  reports: Report[]
  reviews: Review[]
  stores: StoreType[]
  onAddProduct: (input: {
    name: string
    storeId: string
    price: number
    units: number
    status: Product['status']
    description: string
  }) => void
  onAddStore: (input: { name: string; city: string; description: string }) => void
  onSignOut: () => void
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void
}

type OwnerPage = 'dashboard' | 'myStores' | 'products' | 'orders' | 'reviews' | 'reports'

const ownerNavigation: Array<{ id: OwnerPage; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'myStores', label: 'My Stores' },
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'reports', label: 'Reports' },
]

const pageCopy: Record<OwnerPage, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Store Owner Dashboard',
    subtitle: 'Store performance, product stock, order queue, and reports.',
  },
  myStores: {
    title: 'My Stores',
    subtitle: 'Manage storefront cards using local mock state.',
  },
  products: {
    title: 'Products',
    subtitle: 'Manage products that also appear in the Customer Home page.',
  },
  orders: {
    title: 'Orders',
    subtitle: 'Update order statuses in the front-end prototype.',
  },
  reviews: {
    title: 'Reviews',
    subtitle: 'View customer reviews for owner products.',
  },
  reports: {
    title: 'Reports',
    subtitle: 'View reports against owner stores.',
  },
}

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`
}

function reportTone(status: Report['status']) {
  if (status === 'Resolved') {
    return 'green'
  }

  if (status === 'Rejected') {
    return 'red'
  }

  return status === 'In Progress' ? 'amber' : 'blue'
}

export default function StoreOwnerDashboard({
  orders,
  products,
  reports,
  reviews,
  stores,
  onAddProduct,
  onAddStore,
  onSignOut,
  onUpdateOrderStatus,
}: StoreOwnerDashboardProps) {
  const [activePage, setActivePage] = useState<OwnerPage>('dashboard')
  const copy = pageCopy[activePage]

  return (
    <DashboardShell
      activeItem={activePage}
      navigation={ownerNavigation}
      onNavigate={(page) => setActivePage(page as OwnerPage)}
      onSignOut={onSignOut}
      role="storeOwner"
      subtitle={copy.subtitle}
      title={copy.title}
    >
      {activePage === 'dashboard' ? (
        <OwnerOverviewPage
          onNavigate={setActivePage}
          orders={orders}
          products={products}
          reports={reports}
          stores={stores}
        />
      ) : null}
      {activePage === 'myStores' ? <MyStoresPage onAddStore={onAddStore} stores={stores} /> : null}
      {activePage === 'products' ? (
        <ProductsPage onAddProduct={onAddProduct} products={products} stores={stores} />
      ) : null}
      {activePage === 'orders' ? (
        <OwnerOrdersPage onUpdateOrderStatus={onUpdateOrderStatus} orders={orders} />
      ) : null}
      {activePage === 'reviews' ? <OwnerReviewsPage reviews={reviews} /> : null}
      {activePage === 'reports' ? <OwnerReportsPage reports={reports} /> : null}
    </DashboardShell>
  )
}

function OwnerOverviewPage({
  stores,
  products,
  orders,
  reports,
  onNavigate,
}: {
  stores: StoreType[]
  products: Product[]
  orders: Order[]
  reports: Report[]
  onNavigate: (page: OwnerPage) => void
}) {
  const pendingOrders = orders.filter((order) =>
    ['Pending', 'Processing', 'Ready to ship'].includes(order.status),
  )
  const lowStockItems = products.filter((product) => product.units <= 6)
  const openReports = reports.filter((report) => report.status === 'Open')

  return (
    <section className="single-page">
      <section className="metric-grid owner-metrics" aria-label="Store owner summary">
        <MetricCard
          detail="Storefronts in this prototype"
          icon={<Store aria-hidden="true" size={20} />}
          label="Total Stores"
          value={String(stores.length)}
        />
        <MetricCard
          detail="Visible to customers"
          icon={<Boxes aria-hidden="true" size={20} />}
          label="Total Products"
          value={String(products.length)}
        />
        <MetricCard
          detail="Awaiting owner action"
          icon={<ClipboardList aria-hidden="true" size={20} />}
          label="Pending Orders"
          value={String(pendingOrders.length)}
        />
        <MetricCard
          detail="Six or fewer units"
          icon={<BarChart3 aria-hidden="true" size={20} />}
          label="Low Stock Items"
          value={String(lowStockItems.length)}
        />
        <MetricCard
          detail="Visible to admin too"
          icon={<ClipboardList aria-hidden="true" size={20} />}
          label="Open Reports"
          value={String(openReports.length)}
        />
      </section>

      <Panel eyebrow="Shortcuts" title="Quick Actions">
        <div className="quick-actions">
          <button className="quick-action" onClick={() => onNavigate('myStores')} type="button">
            <Store aria-hidden="true" size={20} />
            <span>Manage Stores</span>
          </button>
          <button className="quick-action" onClick={() => onNavigate('products')} type="button">
            <Boxes aria-hidden="true" size={20} />
            <span>Manage Products</span>
          </button>
          <button className="quick-action" onClick={() => onNavigate('orders')} type="button">
            <ClipboardList aria-hidden="true" size={20} />
            <span>View Orders</span>
          </button>
        </div>
      </Panel>
    </section>
  )
}

function MyStoresPage({
  stores,
  onAddStore,
}: {
  stores: StoreType[]
  onAddStore: (input: { name: string; city: string; description: string }) => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', description: '' })

  return (
    <section className="single-page">
      <div className="page-toolbar">
        <div>
          <p>Operations</p>
          <h2>My Stores</h2>
        </div>
        <button className="primary-button" onClick={() => setIsModalOpen(true)} type="button">
          <Plus aria-hidden="true" size={18} />
          Add Store
        </button>
      </div>

      {stores.length > 0 ? (
        <div className="store-list store-grid">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No stores yet.</p>
      )}

      {isModalOpen ? (
        <Modal title="Add Store" onClose={() => setIsModalOpen(false)}>
          <form
            className="prototype-form"
            onSubmit={(event) => {
              event.preventDefault()
              onAddStore(form)
              setForm({ name: '', city: '', description: '' })
              setIsModalOpen(false)
            }}
          >
            <label className="field" htmlFor="store-name">
              <span>Store Name</span>
              <input
                id="store-name"
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                value={form.name}
              />
            </label>
            <label className="field" htmlFor="store-city">
              <span>City</span>
              <input
                id="store-city"
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                value={form.city}
              />
            </label>
            <label className="field" htmlFor="store-description">
              <span>Description</span>
              <textarea
                id="store-description"
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows={4}
                value={form.description}
              />
            </label>
            <button className="primary-button" type="submit">
              Add Store
            </button>
          </form>
        </Modal>
      ) : null}
    </section>
  )
}

function ProductsPage({
  stores,
  products,
  onAddProduct,
}: {
  stores: StoreType[]
  products: Product[]
  onAddProduct: (input: {
    name: string
    storeId: string
    price: number
    units: number
    status: Product['status']
    description: string
  }) => void
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    storeId: stores[0]?.id ?? '',
    price: '0',
    units: '1',
    status: 'Active' as Product['status'],
    description: '',
  })

  return (
    <section className="single-page">
      <div className="page-toolbar">
        <div>
          <p>Catalog</p>
          <h2>Products</h2>
        </div>
        <button className="primary-button" onClick={() => setIsModalOpen(true)} type="button">
          <Plus aria-hidden="true" size={18} />
          Add Product
        </button>
      </div>

      <Panel eyebrow="Inventory" title="Product Management">
        <DataTable
          columns={[
            { header: 'Product', cell: (product) => product.name },
            { header: 'Store', cell: (product) => product.storeName },
            { header: 'Price', cell: (product) => formatCurrency(product.price) },
            { header: 'Available Units', cell: (product) => product.units.toString() },
            {
              header: 'Status',
              cell: (product) => (
                <StatusPill tone={product.status === 'Active' ? 'green' : product.status === 'Low Stock' ? 'amber' : 'neutral'}>
                  {product.status}
                </StatusPill>
              ),
            },
          ]}
          rowKey={(product) => product.id}
          rows={products}
        />
      </Panel>

      {isModalOpen ? (
        <Modal title="Add Product" onClose={() => setIsModalOpen(false)}>
          <form
            className="prototype-form"
            onSubmit={(event) => {
              event.preventDefault()
              onAddProduct({
                name: form.name,
                storeId: form.storeId,
                price: Number(form.price),
                units: Number(form.units),
                status: form.status,
                description: form.description,
              })
              setForm({
                name: '',
                storeId: stores[0]?.id ?? '',
                price: '0',
                units: '1',
                status: 'Active',
                description: '',
              })
              setIsModalOpen(false)
            }}
          >
            <label className="field" htmlFor="product-name">
              <span>Product Name</span>
              <input
                id="product-name"
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                value={form.name}
              />
            </label>
            <label className="field" htmlFor="product-store">
              <span>Store</span>
              <select
                id="product-store"
                onChange={(event) => setForm({ ...form, storeId: event.target.value })}
                value={form.storeId}
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" htmlFor="product-price">
              <span>Price</span>
              <input
                id="product-price"
                min="0"
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                step="0.01"
                type="number"
                value={form.price}
              />
            </label>
            <label className="field" htmlFor="product-units">
              <span>Available Units</span>
              <input
                id="product-units"
                min="0"
                onChange={(event) => setForm({ ...form, units: event.target.value })}
                type="number"
                value={form.units}
              />
            </label>
            <label className="field" htmlFor="product-status">
              <span>Status</span>
              <select
                id="product-status"
                onChange={(event) => setForm({ ...form, status: event.target.value as Product['status'] })}
                value={form.status}
              >
                <option value="Active">Active</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Paused">Paused</option>
              </select>
            </label>
            <label className="field" htmlFor="product-description">
              <span>Description</span>
              <textarea
                id="product-description"
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                rows={4}
                value={form.description}
              />
            </label>
            <button className="primary-button" type="submit">
              Add Product
            </button>
          </form>
        </Modal>
      ) : null}
    </section>
  )
}

function OwnerOrdersPage({
  orders,
  onUpdateOrderStatus,
}: {
  orders: Order[]
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void
}) {
  const statuses: OrderStatus[] = [
    'Pending',
    'Processing',
    'Ready to ship',
    'Out for delivery',
    'Delivered',
    'Issue',
  ]

  return (
    <section className="single-page">
      <Panel eyebrow="Fulfillment" title="Orders">
        <DataTable
          columns={[
            { header: 'Order ID', cell: (order) => order.id },
            { header: 'Customer', cell: (order) => order.customer },
            { header: 'Product', cell: (order) => order.productName },
            { header: 'Quantity', cell: (order) => order.quantity.toString() },
            { header: 'Total', cell: (order) => formatCurrency(order.total) },
            {
              header: 'Status',
              cell: (order) => (
                <select
                  className="table-select"
                  onChange={(event) => onUpdateOrderStatus(order.id, event.target.value as OrderStatus)}
                  value={order.status}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              ),
            },
            { header: 'Date', cell: (order) => order.date },
          ]}
          rowKey={(order) => order.id}
          rows={orders}
        />
      </Panel>
    </section>
  )
}

function OwnerReviewsPage({ reviews }: { reviews: Review[] }) {
  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Store review summary">
        <MetricCard
          detail="Across owner products"
          icon={<Star aria-hidden="true" size={20} />}
          label="Reviews"
          value={String(reviews.length)}
        />
        <MetricCard
          detail="Average customer score"
          icon={<ClipboardList aria-hidden="true" size={20} />}
          label="Average Rating"
          value={
            reviews.length
              ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
              : '0.0'
          }
        />
      </section>

      <Panel eyebrow="Feedback" title="Reviews">
        <DataTable
          columns={[
            { header: 'Review', cell: (review) => review.id },
            { header: 'Customer', cell: (review) => review.customer },
            { header: 'Product', cell: (review) => review.productName },
            { header: 'Rating', cell: (review) => `${review.rating} stars` },
            { header: 'Comment', cell: (review) => review.comment },
            { header: 'Date', cell: (review) => review.date },
          ]}
          rowKey={(review) => review.id}
          rows={reviews}
        />
      </Panel>
    </section>
  )
}

function OwnerReportsPage({ reports }: { reports: Report[] }) {
  return (
    <section className="single-page">
      <p className="notice-card">Store owners can view reports for their stores. Only admins can close reports.</p>
      <Panel eyebrow="Reporting" title="Reports">
        <DataTable
          columns={[
            { header: 'Report', cell: (report) => report.id },
            { header: 'Customer', cell: (report) => report.customer },
            { header: 'Store', cell: (report) => report.storeName },
            { header: 'Issue', cell: (report) => report.issue },
            {
              header: 'Status',
              cell: (report) => <StatusPill tone={reportTone(report.status)}>{report.status}</StatusPill>,
            },
            { header: 'Date', cell: (report) => report.date },
          ]}
          rowKey={(report) => report.id}
          rows={reports}
        />
      </Panel>
    </section>
  )
}

function StoreCard({ store }: { store: StoreType }) {
  return (
    <article className="store-card">
      <div>
        <h3>{store.name}</h3>
        <span>{store.city}</span>
      </div>
      <p>{store.description}</p>
      <dl>
        <div>
          <dt>Owner</dt>
          <dd>{store.owner}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{store.status}</dd>
        </div>
      </dl>
      <StatusPill tone="green">{store.status}</StatusPill>
    </article>
  )
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section aria-modal="true" className="modal-panel" role="dialog">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} type="button">
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
