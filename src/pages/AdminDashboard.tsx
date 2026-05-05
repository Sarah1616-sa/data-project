import { useState } from 'react'
import { Activity, AlertTriangle, MonitorCheck, ShieldCheck } from 'lucide-react'
import DashboardShell from '../components/DashboardShell'
import { DataTable, StatusPill } from '../components/DataTable'
import MetricCard from '../components/MetricCard'
import Panel from '../components/Panel'

type AdminDashboardProps = {
  onSignOut: () => void
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
    title: 'Dashboard',
    subtitle: 'Platform moderation, sessions, and audit activity.',
  },
  manageReports: {
    title: 'Manage Reports',
    subtitle: 'Triage customer and store owner reports.',
  },
  adminLogs: {
    title: 'Admin Logs',
    subtitle: 'Review moderation and system audit events.',
  },
  sessions: {
    title: 'Sessions',
    subtitle: 'Monitor active account sessions and access status.',
  },
}

const reports = [
  {
    id: 'RPT-700',
    source: 'Customer',
    subject: 'Payment dispute',
    priority: 'High',
    status: 'Open',
  },
  {
    id: 'RPT-699',
    source: 'Store Owner',
    subject: 'Duplicate listing',
    priority: 'Medium',
    status: 'Review',
  },
  {
    id: 'RPT-693',
    source: 'Customer',
    subject: 'Refund confirmation',
    priority: 'Low',
    status: 'Resolved',
  },
]

const sessions = [
  {
    id: 'SES-91',
    user: 'mona@example.com',
    role: 'Customer',
    device: 'Chrome / Windows',
    status: 'Active',
  },
  {
    id: 'SES-88',
    user: 'owner@example.com',
    role: 'Store Owner',
    device: 'Safari / iOS',
    status: 'Active',
  },
  {
    id: 'SES-84',
    user: 'admin@example.com',
    role: 'Admin',
    device: 'Edge / Windows',
    status: 'Flagged',
  },
]

const adminLogs = [
  {
    id: 'LOG-502',
    actor: 'Admin A.',
    action: 'Resolved report RPT-693',
    time: '10:42',
    result: 'Completed',
  },
  {
    id: 'LOG-501',
    actor: 'Admin B.',
    action: 'Reviewed session SES-84',
    time: '10:21',
    result: 'Follow-up',
  },
  {
    id: 'LOG-498',
    actor: 'Admin A.',
    action: 'Exported report queue',
    time: '09:55',
    result: 'Completed',
  },
]

export default function AdminDashboard({ onSignOut }: AdminDashboardProps) {
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
      {activePage === 'dashboard' ? <AdminOverviewPage /> : null}
      {activePage === 'manageReports' ? <ManageReportsPage /> : null}
      {activePage === 'adminLogs' ? <AdminLogsPage /> : null}
      {activePage === 'sessions' ? <SessionsPage /> : null}
    </DashboardShell>
  )
}

function AdminOverviewPage() {
  return (
    <section className="single-page">
      <section className="metric-grid" aria-label="Admin summary">
        <MetricCard
          detail="Three high priority"
          icon={<AlertTriangle aria-hidden="true" size={20} />}
          label="Open Reports"
          value="7"
        />
        <MetricCard
          detail="Across all roles"
          icon={<MonitorCheck aria-hidden="true" size={20} />}
          label="Sessions"
          value="31"
        />
        <MetricCard
          detail="Audit entries today"
          icon={<Activity aria-hidden="true" size={20} />}
          label="Admin Logs"
          value="124"
        />
        <MetricCard
          detail="Two stores in review"
          icon={<ShieldCheck aria-hidden="true" size={20} />}
          label="Verification"
          value="18"
        />
      </section>

      <section className="content-grid compact-grid">
        <Panel eyebrow="Moderation" title="Open Reports">
          <ReportsTable rows={reports.slice(0, 2)} />
        </Panel>

        <Panel eyebrow="Access" title="Flagged Sessions">
          <SessionsTable rows={sessions.filter((session) => session.status === 'Flagged')} />
        </Panel>
      </section>
    </section>
  )
}

function ManageReportsPage() {
  return (
    <section className="single-page">
      <Panel eyebrow="Moderation" title="Manage Reports">
        <ReportsTable rows={reports} />
      </Panel>
    </section>
  )
}

function AdminLogsPage() {
  return (
    <section className="single-page">
      <Panel eyebrow="Audit" title="Admin Logs">
        <DataTable
          columns={[
            { header: 'Log', cell: (log) => log.id },
            { header: 'Actor', cell: (log) => log.actor },
            { header: 'Action', cell: (log) => log.action },
            { header: 'Time', cell: (log) => log.time },
            {
              header: 'Result',
              cell: (log) => (
                <StatusPill tone={log.result === 'Completed' ? 'green' : 'amber'}>
                  {log.result}
                </StatusPill>
              ),
            },
          ]}
          rowKey={(log) => log.id}
          rows={adminLogs}
        />
      </Panel>
    </section>
  )
}

function SessionsPage() {
  return (
    <section className="single-page">
      <Panel eyebrow="Access" title="Sessions">
        <SessionsTable rows={sessions} />
      </Panel>
    </section>
  )
}

function ReportsTable({ rows }: { rows: typeof reports }) {
  return (
    <DataTable
      columns={[
        { header: 'Report', cell: (report) => report.id },
        { header: 'Source', cell: (report) => report.source },
        { header: 'Subject', cell: (report) => report.subject },
        {
          header: 'Priority',
          cell: (report) => (
            <StatusPill
              tone={
                report.priority === 'High'
                  ? 'red'
                  : report.priority === 'Medium'
                    ? 'amber'
                    : 'neutral'
              }
            >
              {report.priority}
            </StatusPill>
          ),
        },
        {
          header: 'Status',
          cell: (report) => (
            <StatusPill tone={report.status === 'Resolved' ? 'green' : 'blue'}>
              {report.status}
            </StatusPill>
          ),
        },
      ]}
      rowKey={(report) => report.id}
      rows={rows}
    />
  )
}

function SessionsTable({ rows }: { rows: typeof sessions }) {
  return (
    <DataTable
      columns={[
        { header: 'Session', cell: (session) => session.id },
        { header: 'User', cell: (session) => session.user },
        { header: 'Role', cell: (session) => session.role },
        { header: 'Device', cell: (session) => session.device },
        {
          header: 'Status',
          cell: (session) => (
            <StatusPill tone={session.status === 'Flagged' ? 'red' : 'green'}>
              {session.status}
            </StatusPill>
          ),
        },
      ]}
      rowKey={(session) => session.id}
      rows={rows}
    />
  )
}
