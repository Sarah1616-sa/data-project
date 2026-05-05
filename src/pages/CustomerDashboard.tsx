import { useState } from 'react'
import {
  ClipboardList,
  Heart,
  MessageSquareWarning,
  PackageCheck,
  ShoppingBag,
  UserRound,
} from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { DataTable, StatusPill } from '../components/DataTable'
import MetricCard from '../components/MetricCard'
import Panel from '../components/Panel'

type CustomerDashboardProps = {
  onSignOut: () => void
}

type CustomerPage = 'browseProducts' | 'myOrders' | 'myReviews' | 'reportIssue' | 'profile'

const customerNavigation: Array<{ id: CustomerPage; label: string }> = [
  { id: 'browseProducts', label: 'Browse Products' },
  { id: 'myOrders', label: 'My Orders' },
  { id: 'myReviews', label: 'My Reviews' },
  { id: 'reportIssue', label: 'Report Issue' },
  { id: 'profile', label: 'Profile' },
]

const pageCopy: Record<CustomerPage, { title: string; subtitle: string }> = {
  browseProducts: {
    title: 'Browse Products',
    subtitle: 'Explore available products from storefronts.',
  },
  myOrders: {
    title: 'My Orders',
    subtitle: 'Track purchases and delivery progress.',
  },
  myReviews: {
    title: 'My Reviews',
    subtitle: 'Manage product feedback and draft reviews.',
  },
  reportIssue: {
    title: 'Report Issue',
    subtitle: 'Prepare a support request for an order or store.',
  },
  profile: {
    title: 'Profile',
    subtitle: 'View customer account details and preferences.',
  },
}

const products = [
  {
    id: 'PR-1001',
    name: 'Everyday Backpack',
    store: 'Urban Supply',
    category: 'Accessories',
    price: '$74.00',
    stock: 'In stock',
    rating: '4.8',
  },
  {
    id: 'PR-1002',
    name: 'Ceramic Mug Set',
    store: 'Home Nest',
    category: 'Home',
    price: '$28.00',
    stock: 'Low stock',
    rating: '4.6',
  },
  {
    id: 'PR-1003',
    name: 'Wireless Desk Lamp',
    store: 'Bright Desk',
    category: 'Office',
    price: '$52.00',
    stock: 'In stock',
    rating: '4.9',
  },
]

const orders = [
  {
    id: 'ORD-2042',
    product: 'Everyday Backpack',
    store: 'Urban Supply',
    status: 'Out for delivery',
    total: '$74.00',
    eta: 'May 7',
  },
  {
    id: 'ORD-2038',
    product: 'Notebook Bundle',
    store: 'Paper Lane',
    status: 'Processing',
    total: '$36.50',
    eta: 'May 9',
  },
  {
    id: 'ORD-2029',
    product: 'Ceramic Mug Set',
    store: 'Home Nest',
    status: 'Delivered',
    total: '$28.00',
    eta: 'May 2',
  },
]

const reviews = [
  {
    id: 'REV-18',
    product: 'Wireless Desk Lamp',
    rating: '5.0',
    status: 'Published',
  },
  {
    id: 'REV-19',
    product: 'Notebook Bundle',
    rating: 'Draft',
    status: 'Draft',
  },
]

const reports = [
  {
    id: 'RPT-41',
    subject: 'Late delivery',
    order: 'ORD-2038',
    status: 'Open',
  },
  {
    id: 'RPT-35',
    subject: 'Refund follow-up',
    order: 'ORD-2017',
    status: 'Resolved',
  },
]

const profile = {
  name: 'Mona Alharbi',
  email: 'mona@example.com',
  phone: '+966 55 123 4567',
  defaultAddress: 'Riyadh, Olaya District',
  preferences: ['Order updates by email', 'Product recommendations', 'Saved payment method'],
}

export default function CustomerDashboard({ onSignOut }: CustomerDashboardProps) {
  const [activePage, setActivePage] = useState<CustomerPage>('browseProducts')
  const copy = pageCopy[activePage]

  return (
    <DashboardShell
      activeItem={activePage}
      navigation={customerNavigation}
      onNavigate={(page) => setActivePage(page as CustomerPage)}
      onSignOut={onSignOut}
      role="customer"
      subtitle={copy.subtitle}
      title={copy.title}
    >
      {activePage === 'browseProducts' ? <BrowseProductsPage /> : null}
      {activePage === 'myOrders' ? <MyOrdersPage /> : null}
      {activePage === 'myReviews' ? <MyReviewsPage /> : null}
      {activePage === 'reportIssue' ? <ReportIssuePage /> : null}
      {activePage === 'profile' ? <ProfilePage /> : null}
    </DashboardShell>
  )
}

function BrowseProductsPage() {
  return (
    <section className="single-page">
      <Panel eyebrow="Catalog" title="Browse Products">
        <div className="product-list">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div>
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.store}</p>
              </div>
              <div>
                <strong>{product.price}</strong>
                <StatusPill tone={product.stock === 'Low stock' ? 'amber' : 'green'}>
                  {product.stock}
                </StatusPill>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  )
}

function MyOrdersPage() {
  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Customer order summary">
        <MetricCard
          detail="Active purchases"
          icon={<PackageCheck aria-hidden="true" size={20} />}
          label="Open Orders"
          value="3"
        />
        <MetricCard
          detail="Arriving this week"
          icon={<ShoppingBag aria-hidden="true" size={20} />}
          label="Deliveries"
          value="2"
        />
      </section>

      <Panel eyebrow="Purchases" title="My Orders">
        <DataTable
          columns={[
            { header: 'Order', cell: (order) => order.id },
            { header: 'Product', cell: (order) => order.product },
            { header: 'Store', cell: (order) => order.store },
            {
              header: 'Status',
              cell: (order) => (
                <StatusPill
                  tone={
                    order.status === 'Delivered'
                      ? 'green'
                      : order.status === 'Processing'
                        ? 'blue'
                        : 'amber'
                  }
                >
                  {order.status}
                </StatusPill>
              ),
            },
            { header: 'ETA', cell: (order) => order.eta },
            { header: 'Total', align: 'right', cell: (order) => order.total },
          ]}
          rowKey={(order) => order.id}
          rows={orders}
        />
      </Panel>
    </section>
  )
}

function MyReviewsPage() {
  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Customer review summary">
        <MetricCard
          detail="Published feedback"
          icon={<Heart aria-hidden="true" size={20} />}
          label="Reviews"
          value="2"
        />
        <MetricCard
          detail="Waiting to finish"
          icon={<ClipboardList aria-hidden="true" size={20} />}
          label="Drafts"
          value="1"
        />
      </section>

      <Panel eyebrow="Feedback" title="My Reviews">
        <DataTable
          columns={[
            { header: 'Review', cell: (review) => review.id },
            { header: 'Product', cell: (review) => review.product },
            { header: 'Rating', cell: (review) => review.rating },
            {
              header: 'Status',
              cell: (review) => (
                <StatusPill tone={review.status === 'Draft' ? 'amber' : 'green'}>
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

function ReportIssuePage() {
  return (
    <section className="single-page">
      <section className="content-grid compact-grid">
        <Panel eyebrow="Support" title="Report Issue">
          <form
            className="prototype-form"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <label className="field" htmlFor="issue-order">
              <span>Order</span>
              <input id="issue-order" defaultValue="ORD-2038" type="text" />
            </label>
            <label className="field" htmlFor="issue-subject">
              <span>Subject</span>
              <input id="issue-subject" defaultValue="Late delivery" type="text" />
            </label>
            <label className="field" htmlFor="issue-detail">
              <span>Details</span>
              <textarea
                id="issue-detail"
                defaultValue="Package has not moved since the last carrier scan."
                rows={5}
              />
            </label>
            <button className="secondary-button" type="submit">
              Save Issue Draft
            </button>
          </form>
        </Panel>

        <Panel eyebrow="History" title="Recent Reports">
          <DataTable
            columns={[
              { header: 'Report', cell: (report) => report.id },
              { header: 'Subject', cell: (report) => report.subject },
              { header: 'Order', cell: (report) => report.order },
              {
                header: 'Status',
                cell: (report) => (
                  <StatusPill tone={report.status === 'Open' ? 'red' : 'green'}>
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
    </section>
  )
}

function ProfilePage() {
  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Customer profile summary">
        <MetricCard
          detail={profile.email}
          icon={<UserRound aria-hidden="true" size={20} />}
          label="Customer"
          value={profile.name}
        />
        <MetricCard
          detail="Support queue"
          icon={<MessageSquareWarning aria-hidden="true" size={20} />}
          label="Open Reports"
          value="1"
        />
      </section>

      <Panel eyebrow="Account" title="Profile">
        <div className="detail-grid">
          <article>
            <span>Email</span>
            <strong>{profile.email}</strong>
          </article>
          <article>
            <span>Phone</span>
            <strong>{profile.phone}</strong>
          </article>
          <article>
            <span>Default Address</span>
            <strong>{profile.defaultAddress}</strong>
          </article>
        </div>
        <ul className="preference-list">
          {profile.preferences.map((preference) => (
            <li key={preference}>{preference}</li>
          ))}
        </ul>
      </Panel>
    </section>
  )
}
