import type { ReactNode } from 'react'
import {
  Boxes,
  FolderKanban,
  Gauge,
  Image,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  Tags,
  Truck,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'

export type DashboardPage =
  | 'overview'
  | 'products'
  | 'brands'
  | 'collections'
  | 'media'
  | 'navigation'
  | 'shipping'
  | 'users'
  | 'settings'

interface DashboardShellProps {
  page: DashboardPage
  onPageChange: (page: DashboardPage) => void
  children: ReactNode
}

const groups: Array<{
  title: string
  items: Array<{ id: DashboardPage; label: string; icon: typeof Gauge }>
}> = [
  {
    title: 'Store',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard },
      { id: 'products', label: 'Products', icon: Package },
      { id: 'brands', label: 'Brands', icon: Tags },
      { id: 'collections', label: 'Collections', icon: FolderKanban },
      { id: 'media', label: 'Media Library', icon: Image },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { id: 'navigation', label: 'Navigation', icon: Boxes },
      { id: 'shipping', label: 'Shipping', icon: Truck },
      { id: 'users', label: 'Users & roles', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function DashboardShell({ page, onPageChange, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigate = (nextPage: DashboardPage) => {
    onPageChange(nextPage)
    setMobileOpen(false)
  }

  return (
    <div className="dashboard-shell">
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark">SC</div>
          <div>
            <strong>Space Call</strong>
            <span>Admin</span>
          </div>
          <button className="icon-button sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {groups.map((group) => (
            <div className="nav-group" key={group.title}>
              <p className="nav-group-title">{group.title}</p>
              {group.items.map(({ id, label, icon: Icon }) => (
                <button
                  className={`nav-item ${page === id ? 'nav-item--active' : ''}`}
                  key={id}
                  onClick={() => navigate(id)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Local development mode
        </div>
      </aside>

      {mobileOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
            <Menu size={20} />
          </button>
          <div>
            <strong>Space Call Dashboard</strong>
            <span className="topbar-subtitle">Independent admin workspace</span>
          </div>
          <div className="topbar-badge">Development</div>
        </header>
        <div className="page-container">{children}</div>
      </main>
    </div>
  )
}
