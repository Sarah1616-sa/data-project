import { useState, type ReactNode } from 'react'
import { Activity, AlertTriangle, ClipboardList, MonitorCheck, ShieldCheck } from 'lucide-react'
import type { AdminLog, Report, ReportStatus, Session } from '../App'
import DashboardShell from '../components/DashboardShell'
import { DataTable, StatusPill } from '../components/DataTable'
import MetricCard from '../components/MetricCard'
import Panel from '../components/Panel'

type AdminDashboardProps = {
  adminLogs: AdminLog[]
  reports: Report[]
  sessions: Session[]
  onSignOut: () => void
  onUpdateReportStatus: (reportId: string, status: ReportStatus, note: string) => void
}

type AdminPage = 'dashboard' | 'manageReports' | 'adminLogs' | 'sessions'

const adminNavigation: Array<{ id: AdminPage; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'manageReports', label: 'Manage Reports' },
  { id: 'adminLogs', label: 'Admin Logs' },
  { id: 'sessions', label: 'Sessions' },
]

const pageCopy: Record<AdminPage, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Admin Dashboard',
    subtitle: 'Report moderation, audit logs, and user session visibility.',
  },
  manageReports: {
    title: 'Manage Reports',
    subtitle: 'Handle customer reports and update their front-end status.',
  },
  adminLogs: {
    title: 'Admin Logs',
    subtitle: 'Track admin actions taken on reports.',
  },
  sessions: {
    title: 'Sessions',
    subtitle: 'Review sample user sessions from mock data.',
  },
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

export default function AdminDashboard({
  adminLogs,
  reports,
  sessions,
  onSignOut,
  onUpdateReportStatus,
}: AdminDashboardProps) {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard')
  const copy = pageCopy[activePage]

  return (
    <DashboardShell
      activeItem={activePage}
      navigation={adminNavigation}
      onNavigate={(page) => setActivePage(page as AdminPage)}
      onSignOut={onSignOut}
      role="admin"
      subtitle={copy.subtitle}
      title={copy.title}
    >
      {activePage === 'dashboard' ? (
        <AdminOverviewPage
          adminLogs={adminLogs}
          onNavigate={setActivePage}
          reports={reports}
          sessions={sessions}
        />
      ) : null}
      {activePage === 'manageReports' ? (
        <ManageReportsPage onUpdateReportStatus={onUpdateReportStatus} reports={reports} />
      ) : null}
      {activePage === 'adminLogs' ? <AdminLogsPage adminLogs={adminLogs} /> : null}
      {activePage === 'sessions' ? <SessionsPage sessions={sessions} /> : null}
    </DashboardShell>
  )
}

function AdminOverviewPage({
  reports,
  adminLogs,
  sessions,
  onNavigate,
}: {
  reports: Report[]
  adminLogs: AdminLog[]
  sessions: Session[]
  onNavigate: (page: AdminPage) => void
}) {
  const openReports = reports.filter((report) => report.status === 'Open')
  const inProgressReports = reports.filter((report) => report.status === 'In Progress')
  const resolvedReports = reports.filter((report) => report.status === 'Resolved')

  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Admin summary">
        <MetricCard
          detail="Needs admin review"
          icon={<AlertTriangle aria-hidden="true" size={20} />}
          label="Open Reports"
          value={String(openReports.length)}
        />
        <MetricCard
          detail="Currently being handled"
          icon={<ClipboardList aria-hidden="true" size={20} />}
          label="In Progress"
          value={String(inProgressReports.length)}
        />
        <MetricCard
          detail="Closed successfully"
          icon={<ShieldCheck aria-hidden="true" size={20} />}
          label="Resolved"
          value={String(resolvedReports.length)}
        />
        <MetricCard
          detail="All submitted reports"
          icon={<Activity aria-hidden="true" size={20} />}
          label="Total Reports"
          value={String(reports.length)}
        />
      </section>

      <Panel eyebrow="Shortcuts" title="Quick Actions">
        <div className="quick-actions">
          <button className="quick-action" onClick={() => onNavigate('manageReports')} type="button">
            <AlertTriangle aria-hidden="true" size={20} />
            <span>Manage Reports</span>
          </button>
          <button className="quick-action" onClick={() => onNavigate('adminLogs')} type="button">
            <Activity aria-hidden="true" size={20} />
            <span>View Logs</span>
          </button>
          <button className="quick-action" onClick={() => onNavigate('sessions')} type="button">
            <MonitorCheck aria-hidden="true" size={20} />
            <span>Track Sessions</span>
          </button>
        </div>
      </Panel>

      <section className="content-grid compact-grid">
        <Panel eyebrow="Audit" title="Recent Logs">
          <DataTable
            columns={[
              { header: 'Log', cell: (log) => log.id },
              { header: 'Report', cell: (log) => log.reportId },
              { header: 'Action', cell: (log) => log.action },
              { header: 'Time', cell: (log) => log.timestamp },
            ]}
            rowKey={(log) => log.id}
            rows={adminLogs.slice(0, 3)}
          />
        </Panel>

        <Panel eyebrow="Responsibilities" title="Administrator Responsibilities">
          <ul className="responsibility-list">
            <li>Review customer-submitted reports and update their status.</li>
            <li>Keep an audit trail for all report handling decisions.</li>
            <li>Monitor active and completed user sessions.</li>
            <li>Coordinate with store owners when reports need follow-up.</li>
          </ul>
          <p className="session-count">{sessions.length} mock sessions available for review.</p>
        </Panel>
      </section>
    </section>
  )
}

function ManageReportsPage({
  reports,
  onUpdateReportStatus,
}: {
  reports: Report[]
  onUpdateReportStatus: (reportId: string, status: ReportStatus, note: string) => void
}) {
  const [activeReport, setActiveReport] = useState<Report | null>(null)

  return (
    <section className="single-page">
      <Panel eyebrow="Moderation" title="Manage Reports">
        <DataTable
          columns={[
            { header: 'Report ID', cell: (report) => report.id },
            { header: 'Customer', cell: (report) => report.customer },
            { header: 'Store', cell: (report) => report.storeName },
            { header: 'Issue', cell: (report) => report.issue },
            {
              header: 'Status',
              cell: (report) => <StatusPill tone={reportTone(report.status)}>{report.status}</StatusPill>,
            },
            { header: 'Date', cell: (report) => report.date },
            {
              header: 'Action',
              cell: (report) => (
                <button className="table-action" onClick={() => setActiveReport(report)} type="button">
                  Handle
                </button>
              ),
            },
          ]}
          rowKey={(report) => report.id}
          rows={reports}
        />
      </Panel>

      {activeReport ? (
        <HandleReportModal
          onClose={() => setActiveReport(null)}
          onSubmit={(status, note) => {
            onUpdateReportStatus(activeReport.id, status, note)
            setActiveReport(null)
          }}
          report={activeReport}
        />
      ) : null}
    </section>
  )
}

function HandleReportModal({
  report,
  onSubmit,
  onClose,
}: {
  report: Report
  onSubmit: (status: ReportStatus, note: string) => void
  onClose: () => void
}) {
  const [status, setStatus] = useState<ReportStatus>(
    report.status === 'Open' ? 'In Progress' : report.status,
  )
  const [note, setNote] = useState(`Handled ${report.id}`)

  return (
    <Modal title={`Handle ${report.id}`} onClose={onClose}>
      <form
        className="prototype-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(status, note)
        }}
      >
        <div className="modal-summary">
          <span>{report.customer}</span>
          <strong>{report.storeName}</strong>
          <p>{report.issue}</p>
        </div>
        <label className="field" htmlFor="report-status">
          <span>Status</span>
          <select
            id="report-status"
            onChange={(event) => setStatus(event.target.value as ReportStatus)}
            value={status}
          >
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </label>
        <label className="field" htmlFor="report-note">
          <span>Admin Note</span>
          <textarea
            id="report-note"
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            value={note}
          />
        </label>
        <button className="primary-button" type="submit">
          Save Report Action
        </button>
      </form>
    </Modal>
  )
}

function AdminLogsPage({ adminLogs }: { adminLogs: AdminLog[] }) {
  return (
    <section className="single-page">
      <Panel eyebrow="Audit" title="Admin Logs">
        <DataTable
          columns={[
            { header: 'Log', cell: (log) => log.id },
            { header: 'Actor', cell: (log) => log.actor },
            { header: 'Report', cell: (log) => log.reportId },
            { header: 'Action', cell: (log) => log.action },
            { header: 'Time', cell: (log) => log.timestamp },
          ]}
          rowKey={(log) => log.id}
          rows={adminLogs}
        />
      </Panel>
    </section>
  )
}

function SessionsPage({ sessions }: { sessions: Session[] }) {
  return (
    <section className="single-page">
      <Panel eyebrow="Access" title="Sessions">
        <DataTable
          columns={[
            { header: 'Session ID', cell: (session) => session.id },
            { header: 'User Type', cell: (session) => session.userType },
            { header: 'Username', cell: (session) => session.username },
            { header: 'Login Time', cell: (session) => session.loginTime },
            { header: 'Logout Time / Status', cell: (session) => session.logoutStatus },
          ]}
          rowKey={(session) => session.id}
          rows={sessions}
        />
      </Panel>
    </section>
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
