import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ClipboardList,
  Heart,
  MessageSquareWarning,
  PackageCheck,
  Search,
  ShoppingBag,
  Star,
  UserRound,
} from 'lucide-react'
import type { CustomerProfile, Order, Product, Report, Review, Store } from '../App'
import DashboardShell from '../components/DashboardShell'
import { DataTable, StatusPill } from '../components/DataTable'
import MetricCard from '../components/MetricCard'
import Panel from '../components/Panel'

type CustomerDashboardProps = {
  allReviews: Review[]
  orders: Order[]
  products: Product[]
  profile: CustomerProfile
  reports: Report[]
  reviews: Review[]
  stores: Store[]
  onPlaceOrder: (productId: string, quantity: number) => void
  onSaveProfile: (profile: CustomerProfile) => void
  onSignOut: () => void
  onSubmitReport: (storeId: string, issue: string) => void
  onSubmitReview: (productId: string, rating: number, comment: string) => void
}

type CustomerPage = 'home' | 'productDetails' | 'myOrders' | 'myReviews' | 'reportIssue' | 'profile'

const customerNavigation: Array<{ id: Exclude<CustomerPage, 'productDetails'>; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'myOrders', label: 'My Orders' },
  { id: 'myReviews', label: 'My Reviews' },
  { id: 'reportIssue', label: 'Report Issue' },
  { id: 'profile', label: 'Profile' },
]

const pageCopy: Record<CustomerPage, { title: string; subtitle: string }> = {
  home: {
    title: 'Customer Dashboard',
    subtitle: 'Browse products, inspect details, and place front-end mock orders.',
  },
  productDetails: {
    title: 'Product Details',
    subtitle: 'Review product information, order quantity, and customer feedback.',
  },
  myOrders: {
    title: 'My Orders',
    subtitle: 'Track purchases and delivery progress.',
  },
  myReviews: {
    title: 'My Reviews',
    subtitle: 'Manage product feedback submitted from this prototype.',
  },
  reportIssue: {
    title: 'Report Issue',
    subtitle: 'Submit a store report and track it in your report history.',
  },
  profile: {
    title: 'Profile',
    subtitle: 'Update visible account details for the front-end flow.',
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

export default function CustomerDashboard({
  allReviews,
  orders,
  products,
  profile,
  reports,
  reviews,
  stores,
  onPlaceOrder,
  onSaveProfile,
  onSignOut,
  onSubmitReport,
  onSubmitReview,
}: CustomerDashboardProps) {
  const [activePage, setActivePage] = useState<CustomerPage>('home')
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id ?? '')
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0]
  const copy = pageCopy[activePage]

  return (
    <DashboardShell
      activeItem={activePage === 'productDetails' ? 'home' : activePage}
      navigation={customerNavigation}
      onNavigate={(page) => setActivePage(page as CustomerPage)}
      onSignOut={onSignOut}
      role="customer"
      subtitle={copy.subtitle}
      title={copy.title}
    >
      {activePage === 'home' ? (
        <CustomerHomePage
          onViewDetails={(productId) => {
            setSelectedProductId(productId)
            setActivePage('productDetails')
          }}
          products={products}
        />
      ) : null}

      {activePage === 'productDetails' && selectedProduct ? (
        <ProductDetailsPage
          onBack={() => setActivePage('home')}
          onOrderPlaced={() => setActivePage('myOrders')}
          onPlaceOrder={onPlaceOrder}
          onSubmitReview={onSubmitReview}
          product={selectedProduct}
          reviews={allReviews.filter((review) => review.productId === selectedProduct.id)}
        />
      ) : null}

      {activePage === 'myOrders' ? <MyOrdersPage orders={orders} /> : null}
      {activePage === 'myReviews' ? <MyReviewsPage reviews={reviews} /> : null}
      {activePage === 'reportIssue' ? (
        <ReportIssuePage onSubmitReport={onSubmitReport} reports={reports} stores={stores} />
      ) : null}
      {activePage === 'profile' ? (
        <ProfilePage onSaveProfile={onSaveProfile} profile={profile} reports={reports} />
      ) : null}
    </DashboardShell>
  )
}

function CustomerHomePage({
  products,
  onViewDetails,
}: {
  products: Product[]
  onViewDetails: (productId: string) => void
}) {
  const [query, setQuery] = useState('')
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return products
    }

    return products.filter((product) =>
      [product.name, product.storeName, product.description].some((value) =>
        value.toLowerCase().includes(normalizedQuery),
      ),
    )
  }, [products, query])

  return (
    <section className="single-page">
      <div className="page-toolbar">
        <div>
          <p>Catalog</p>
          <h2>Browse Products</h2>
        </div>
        <label className="search-field" htmlFor="product-search">
          <Search aria-hidden="true" size={18} />
          <input
            id="product-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products or stores"
            type="search"
            value={query}
          />
        </label>
      </div>

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <article className="product-card catalog-card" key={product.id}>
            <div>
              <span>{product.storeName}</span>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
            <dl className="card-facts">
              <div>
                <dt>Price</dt>
                <dd>{formatCurrency(product.price)}</dd>
              </div>
              <div>
                <dt>Available</dt>
                <dd>{product.units} units</dd>
              </div>
            </dl>
            <button className="secondary-button" onClick={() => onViewDetails(product.id)} type="button">
              View Details
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

function ProductDetailsPage({
  product,
  reviews,
  onBack,
  onOrderPlaced,
  onPlaceOrder,
  onSubmitReview,
}: {
  product: Product
  reviews: Review[]
  onBack: () => void
  onOrderPlaced: () => void
  onPlaceOrder: (productId: string, quantity: number) => void
  onSubmitReview: (productId: string, rating: number, comment: string) => void
}) {
  const [quantity, setQuantity] = useState(1)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')

  return (
    <section className="single-page">
      <button className="text-button" onClick={onBack} type="button">
        <ArrowLeft aria-hidden="true" size={18} />
        Back to Home
      </button>

      <section className="content-grid">
        <Panel eyebrow={product.storeName} title={product.name}>
          <div className="detail-body">
            <p>{product.description}</p>
            <div className="detail-grid no-padding">
              <article>
                <span>Price</span>
                <strong>{formatCurrency(product.price)}</strong>
              </article>
              <article>
                <span>Available Units</span>
                <strong>{product.units}</strong>
              </article>
              <article>
                <span>Status</span>
                <strong>{product.status}</strong>
              </article>
            </div>

            <label className="field quantity-field" htmlFor="order-quantity">
              <span>Quantity</span>
              <input
                id="order-quantity"
                max={Math.max(1, product.units)}
                min="1"
                onChange={(event) => setQuantity(Number(event.target.value))}
                type="number"
                value={quantity}
              />
            </label>

            <div className="button-row">
              <button
                className="primary-button"
                disabled={product.units <= 0}
                onClick={() => {
                  onPlaceOrder(product.id, quantity)
                  onOrderPlaced()
                }}
                type="button"
              >
                Place Order
              </button>
              <button className="secondary-button" onClick={() => setShowReviewForm(true)} type="button">
                Write a Review
              </button>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Feedback" title="Customer Reviews">
          <div className="review-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div>
                    <strong>{review.customer}</strong>
                    <span>{review.date}</span>
                  </div>
                  <p>{review.comment}</p>
                  <StatusPill tone="amber">{review.rating} stars</StatusPill>
                </article>
              ))
            ) : (
              <p className="empty-state">No reviews for this product yet.</p>
            )}
          </div>
        </Panel>
      </section>

      {showReviewForm ? (
        <Panel eyebrow="Review" title="Write a Review">
          <form
            className="prototype-form"
            onSubmit={(event) => {
              event.preventDefault()
              onSubmitReview(product.id, Number(rating), comment)
              setComment('')
              setShowReviewForm(false)
            }}
          >
            <label className="field" htmlFor="review-rating">
              <span>Rating</span>
              <select id="review-rating" onChange={(event) => setRating(event.target.value)} value={rating}>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </label>
            <label className="field" htmlFor="review-comment">
              <span>Comment</span>
              <textarea
                id="review-comment"
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share your experience with this product"
                required
                rows={5}
                value={comment}
              />
            </label>
            <div className="button-row">
              <button className="primary-button" type="submit">
                Submit Review
              </button>
              <button className="secondary-button" onClick={() => setShowReviewForm(false)} type="button">
                Cancel
              </button>
            </div>
          </form>
        </Panel>
      ) : null}
    </section>
  )
}

function MyOrdersPage({ orders }: { orders: Order[] }) {
  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Customer order summary">
        <MetricCard
          detail="Front-end mock purchases"
          icon={<PackageCheck aria-hidden="true" size={20} />}
          label="Total Orders"
          value={String(orders.length)}
        />
        <MetricCard
          detail="Waiting for fulfillment"
          icon={<ShoppingBag aria-hidden="true" size={20} />}
          label="Pending"
          value={String(orders.filter((order) => order.status === 'Pending').length)}
        />
      </section>

      <Panel eyebrow="Purchases" title="My Orders">
        <DataTable
          columns={[
            { header: 'Order', cell: (order) => order.id },
            { header: 'Product', cell: (order) => order.productName },
            { header: 'Store', cell: (order) => order.storeName },
            { header: 'Qty', cell: (order) => order.quantity.toString() },
            {
              header: 'Status',
              cell: (order) => <StatusPill tone={order.status === 'Delivered' ? 'green' : 'blue'}>{order.status}</StatusPill>,
            },
            { header: 'Date', cell: (order) => order.date },
            { header: 'Total', align: 'right', cell: (order) => formatCurrency(order.total) },
          ]}
          rowKey={(order) => order.id}
          rows={orders}
        />
      </Panel>
    </section>
  )
}

function MyReviewsPage({ reviews }: { reviews: Review[] }) {
  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Customer review summary">
        <MetricCard
          detail="Submitted in this prototype"
          icon={<Heart aria-hidden="true" size={20} />}
          label="Reviews"
          value={String(reviews.length)}
        />
        <MetricCard
          detail="Average submitted score"
          icon={<Star aria-hidden="true" size={20} />}
          label="Average Rating"
          value={
            reviews.length
              ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1)
              : '0.0'
          }
        />
      </section>

      <Panel eyebrow="Feedback" title="My Reviews">
        <DataTable
          columns={[
            { header: 'Review', cell: (review) => review.id },
            { header: 'Product', cell: (review) => review.productName },
            { header: 'Store', cell: (review) => review.storeName },
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

function ReportIssuePage({
  stores,
  reports,
  onSubmitReport,
}: {
  stores: Store[]
  reports: Report[]
  onSubmitReport: (storeId: string, issue: string) => void
}) {
  const [storeId, setStoreId] = useState(stores[0]?.id ?? '')
  const [issue, setIssue] = useState('')

  return (
    <section className="single-page">
      <section className="content-grid compact-grid">
        <Panel eyebrow="Support" title="Report Issue">
          <form
            className="prototype-form"
            onSubmit={(event) => {
              event.preventDefault()
              onSubmitReport(storeId, issue)
              setIssue('')
            }}
          >
            <label className="field" htmlFor="issue-store">
              <span>Store</span>
              <select id="issue-store" onChange={(event) => setStoreId(event.target.value)} value={storeId}>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field" htmlFor="issue-detail">
              <span>Issue Description</span>
              <textarea
                id="issue-detail"
                onChange={(event) => setIssue(event.target.value)}
                placeholder="Describe the issue with this store or order"
                required
                rows={6}
                value={issue}
              />
            </label>
            <button className="primary-button" type="submit">
              Submit Report
            </button>
          </form>
        </Panel>

        <Panel eyebrow="History" title="My Reports">
          <DataTable
            columns={[
              { header: 'Report', cell: (report) => report.id },
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
    </section>
  )
}

function ProfilePage({
  profile,
  reports,
  onSaveProfile,
}: {
  profile: CustomerProfile
  reports: Report[]
  onSaveProfile: (profile: CustomerProfile) => void
}) {
  const [form, setForm] = useState(profile)

  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Customer profile summary">
        <MetricCard
          detail={form.email}
          icon={<UserRound aria-hidden="true" size={20} />}
          label="Username"
          value={form.username}
        />
        <MetricCard
          detail="Submitted by this customer"
          icon={<MessageSquareWarning aria-hidden="true" size={20} />}
          label="Reports"
          value={String(reports.length)}
        />
      </section>

      <Panel eyebrow="Account" title="Profile">
        <form
          className="prototype-form form-grid"
          onSubmit={(event) => {
            event.preventDefault()
            onSaveProfile(form)
          }}
        >
          <label className="field" htmlFor="profile-username">
            <span>Username</span>
            <input
              id="profile-username"
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              value={form.username}
            />
          </label>
          <label className="field" htmlFor="profile-email">
            <span>Email</span>
            <input
              id="profile-email"
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              type="email"
              value={form.email}
            />
          </label>
          <label className="field" htmlFor="profile-role">
            <span>Role</span>
            <input id="profile-role" readOnly value={form.role} />
          </label>
          <label className="field" htmlFor="profile-phone">
            <span>Phone Number</span>
            <input
              id="profile-phone"
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              value={form.phone}
            />
          </label>
          <label className="field field-wide" htmlFor="profile-address">
            <span>Address</span>
            <input
              id="profile-address"
              onChange={(event) => setForm({ ...form, address: event.target.value })}
              value={form.address}
            />
          </label>
          <label className="field field-wide" htmlFor="profile-bio">
            <span>Bio</span>
            <textarea
              id="profile-bio"
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              rows={5}
              value={form.bio}
            />
          </label>
          <button className="primary-button" type="submit">
            Save Changes
          </button>
        </form>
      </Panel>
    </section>
  )
}
