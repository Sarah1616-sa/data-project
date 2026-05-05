import { useState } from 'react'
import { BarChart3, Boxes, ClipboardList, Star, Store } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { DataTable, StatusPill } from '../components/DataTable'
import MetricCard from '../components/MetricCard'
import Panel from '../components/Panel'

type StoreOwnerDashboardProps = {
  onSignOut: () => void
}

type OwnerPage = 'dashboard' | 'myStores' | 'productManagement' | 'orders' | 'reviews' | 'reports'

const ownerNavigation: Array<{ id: OwnerPage; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'myStores', label: 'My Stores' },
  { id: 'productManagement', label: 'Product Management' },
  { id: 'orders', label: 'Orders' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'reports', label: 'Reports' },
]

const pageCopy: Record<OwnerPage, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Store performance, orders, and catalog health.',
  },
  myStores: {
    title: 'My Stores',
    subtitle: 'Review storefront status and store details.',
  },
  productManagement: {
    title: 'Product Management',
    subtitle: 'Manage inventory, pricing, and product status.',
  },
  orders: {
    title: 'Orders',
    subtitle: 'Process pending orders and fulfillment tasks.',
  },
  reviews: {
    title: 'Reviews',
    subtitle: 'Monitor customer feedback across products.',
  },
  reports: {
    title: 'Reports',
    subtitle: 'Review sales, stock, and operational reports.',
  },
}

const stores = [
  {
    id: 'STR-01',
    name: 'Urban Supply',
    status: 'Open',
    city: 'Riyadh',
    products: 48,
    rating: '4.7',
  },
  {
    id: 'STR-02',
    name: 'Home Nest',
    status: 'Open',
    city: 'Jeddah',
    products: 32,
    rating: '4.5',
  },
]

const products = [
  {
    id: 'PR-1001',
    name: 'Everyday Backpack',
    sku: 'BAG-118',
    inventory: 34,
    status: 'Active',
    price: '$74.00',
  },
  {
    id: 'PR-1002',
    name: 'Ceramic Mug Set',
    sku: 'HOM-220',
    inventory: 6,
    status: 'Low stock',
    price: '$28.00',
  },
  {
    id: 'PR-1008',
    name: 'Desk Organizer',
    sku: 'OFF-441',
    inventory: 0,
    status: 'Paused',
    price: '$31.00',
  },
]

const orders = [
  {
    id: 'ORD-3091',
    customer: 'Mona A.',
    product: 'Everyday Backpack',
    status: 'Ready to ship',
    total: '$74.00',
  },
  {
    id: 'ORD-3090',
    customer: 'Faisal K.',
    product: 'Ceramic Mug Set',
    status: 'Paid',
    total: '$28.00',
  },
  {
    id: 'ORD-3087',
    customer: 'Sara M.',
    product: 'Desk Organizer',
    status: 'Issue',
    total: '$31.00',
  },
]

const reviews = [
  {
    id: 'REV-92',
    product: 'Everyday Backpack',
    customer: 'Lina H.',
    rating: '5.0',
    status: 'New',
  },
  {
    id: 'REV-89',
    product: 'Ceramic Mug Set',
    customer: 'Omar S.',
    rating: '4.0',
    status: 'Reviewed',
  },
]

const reports = [
  {
    id: 'RPT-64',
    title: 'Inventory variance',
    store: 'Urban Supply',
    status: 'Investigating',
  },
  {
    id: 'RPT-58',
    title: 'Monthly sales',
    store: 'Home Nest',
    status: 'Ready',
  },
]

export default function StoreOwnerDashboard({ onSignOut }: StoreOwnerDashboardProps) {
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
      {activePage === 'dashboard' ? <OwnerOverviewPage /> : null}
      {activePage === 'myStores' ? <MyStoresPage /> : null}
      {activePage === 'productManagement' ? <ProductManagementPage /> : null}
      {activePage === 'orders' ? <OwnerOrdersPage /> : null}
      {activePage === 'reviews' ? <OwnerReviewsPage /> : null}
      {activePage === 'reports' ? <OwnerReportsPage /> : null}
    </DashboardShell>
  )
}

function OwnerOverviewPage() {
  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Store owner summary">
        <MetricCard
          detail="Across two storefronts"
          icon={<Store aria-hidden="true" size={20} />}
          label="Stores"
          value="2"
        />
        <MetricCard
          detail="Six low-stock items"
          icon={<Boxes aria-hidden="true" size={20} />}
          label="Products"
          value="80"
        />
        <MetricCard
          detail="Nine pending"
          icon={<ClipboardList aria-hidden="true" size={20} />}
          label="Orders"
          value="27"
        />
        <MetricCard
          detail="Current month"
          icon={<BarChart3 aria-hidden="true" size={20} />}
          label="Revenue"
          value="$18.4k"
        />
      </section>

      <section className="content-grid compact-grid">
        <Panel eyebrow="Operations" title="Store Snapshot">
          <div className="store-list">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Fulfillment" title="Recent Orders">
          <OrdersTable rows={orders.slice(0, 2)} />
        </Panel>
      </section>
    </section>
  )
}

function MyStoresPage() {
  return (
    <section className="single-page">
      <Panel eyebrow="Operations" title="My Stores">
        <div className="store-list">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </Panel>
    </section>
  )
}

function ProductManagementPage() {
  return (
    <section className="single-page">
      <Panel eyebrow="Catalog" title="Product Management">
        <DataTable
          columns={[
            { header: 'Product', cell: (product) => product.name },
            { header: 'SKU', cell: (product) => product.sku },
            { header: 'Inventory', cell: (product) => product.inventory.toString() },
            {
              header: 'Status',
              cell: (product) => (
                <StatusPill
                  tone={
                    product.status === 'Active'
                      ? 'green'
                      : product.status === 'Low stock'
                        ? 'amber'
                        : 'neutral'
                  }
                >
                  {product.status}
                </StatusPill>
              ),
            },
            { header: 'Price', align: 'right', cell: (product) => product.price },
          ]}
          rowKey={(product) => product.id}
          rows={products}
        />
      </Panel>
    </section>
  )
}

function OwnerOrdersPage() {
  return (
    <section className="single-page">
      <Panel eyebrow="Fulfillment" title="Orders">
        <OrdersTable rows={orders} />
      </Panel>
    </section>
  )
}

function OwnerReviewsPage() {
  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Store review summary">
        <MetricCard
          detail="Across active products"
          icon={<Star aria-hidden="true" size={20} />}
          label="Average Rating"
          value="4.6"
        />
        <MetricCard
          detail="Needs owner response"
          icon={<ClipboardList aria-hidden="true" size={20} />}
          label="New Reviews"
          value="1"
        />
      </section>

      <Panel eyebrow="Feedback" title="Reviews">
        <DataTable
          columns={[
            { header: 'Review', cell: (review) => review.id },
            { header: 'Product', cell: (review) => review.product },
            { header: 'Customer', cell: (review) => review.customer },
            { header: 'Rating', cell: (review) => review.rating },
            {
              header: 'Status',
              cell: (review) => (
                <StatusPill tone={review.status === 'New' ? 'blue' : 'green'}>
                  {review.status}
                </StatusPill>
              ),
            },
          ]}
          rowKey={(review) => review.id}
          rows={reviews}
        />
      </Panel>
    </section>
  )
}

function OwnerReportsPage() {
  return (
    <section className="single-page">
      <Panel eyebrow="Reporting" title="Reports">
        <DataTable
          columns={[
            { header: 'Report', cell: (report) => report.id },
            { header: 'Title', cell: (report) => report.title },
            { header: 'Store', cell: (report) => report.store },
            {
              header: 'Status',
              cell: (report) => (
                <StatusPill tone={report.status === 'Ready' ? 'green' : 'amber'}>
                  {report.status}
                </StatusPill>
              ),
            },
          ]}
          rowKey={(report) => report.id}
          rows={reports}
        />
      </Panel>
    </section>
  )
}

function StoreCard({ store }: { store: (typeof stores)[number] }) {
  return (
    <article className="store-card">
      <div>
        <h3>{store.name}</h3>
        <span>{store.city}</span>
      </div>
      <dl>
        <div>
          <dt>Products</dt>
          <dd>{store.products}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>{store.rating}</dd>
        </div>
      </dl>
      <StatusPill tone="green">{store.status}</StatusPill>
    </article>
  )
}

function OrdersTable({ rows }: { rows: typeof orders }) {
  return (
    <DataTable
      columns={[
        { header: 'Order', cell: (order) => order.id },
        { header: 'Customer', cell: (order) => order.customer },
        { header: 'Product', cell: (order) => order.product },
        {
          header: 'Status',
          cell: (order) => (
            <StatusPill
              tone={
                order.status === 'Issue'
                  ? 'red'
                  : order.status === 'Ready to ship'
                    ? 'amber'
                    : 'blue'
              }
            >
              {order.status}
            </StatusPill>
          ),
        },
        { header: 'Total', align: 'right', cell: (order) => order.total },
      ]}
      rowKey={(order) => order.id}
      rows={rows}
    />
  )
}
