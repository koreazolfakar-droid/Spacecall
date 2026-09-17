import { useState } from 'react'
import { DashboardShell, type DashboardPage } from './components/DashboardShell'
import { OverviewPage } from './pages/OverviewPage'
import { ProductsPage } from './pages/ProductsPage'
import { BrandsPage } from './pages/BrandsPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  const [page, setPage] = useState<DashboardPage>('overview')

  return (
    <DashboardShell page={page} onPageChange={setPage}>
      {page === 'overview' && <OverviewPage />}
      {page === 'products' && <ProductsPage />}
      {page === 'brands' && <BrandsPage />}
      {page === 'collections' && <CollectionsPage />}
      {page === 'settings' && <SettingsPage />}
      {page === 'media' && <ComingSoon title="Media Library" body="Media upload, asset reuse and image metadata are next in the integration layer." />}
      {page === 'navigation' && <ComingSoon title="Navigation Builder" body="Menu trees and storefront navigation ordering will be implemented on top of the settings model." />}
      {page === 'shipping' && <ComingSoon title="Shipping" body="Basic shipping values already live under Settings; zone-based rules will be added with the backend contract." />}
      {page === 'users' && <ComingSoon title="Users & roles" body="Authentication and role permissions are intentionally deferred until a secure backend is connected." />}
    </DashboardShell>
  )
}

function ComingSoon({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <div className="page-heading"><div><p className="eyebrow">Foundation ready</p><h1>{title}</h1><p>{body}</p></div></div>
      <article className="panel empty-state empty-state--large">This module is reserved in the navigation and data architecture so it can be added without restructuring the Dashboard.</article>
    </section>
  )
}
