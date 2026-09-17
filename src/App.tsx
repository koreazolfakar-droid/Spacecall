import { useState } from 'react'
import { DashboardShell, type DashboardPage } from './components/DashboardShell'
import { OverviewPage } from './pages/OverviewPage'
import { ProductsPage } from './pages/ProductsPage'
import { BrandsPage } from './pages/BrandsPage'
import { CollectionsPage } from './pages/CollectionsPage'
import { SettingsPage } from './pages/SettingsPage'
import { MediaPage } from './pages/MediaPage'
import { NavigationPage } from './pages/NavigationPage'
import { ShippingPage } from './pages/ShippingPage'
import { UsersPage } from './pages/UsersPage'

export default function App() {
  const [page, setPage] = useState<DashboardPage>('overview')

  return (
    <DashboardShell page={page} onPageChange={setPage}>
      {page === 'overview' && <OverviewPage />}
      {page === 'products' && <ProductsPage />}
      {page === 'brands' && <BrandsPage />}
      {page === 'collections' && <CollectionsPage />}
      {page === 'media' && <MediaPage />}
      {page === 'navigation' && <NavigationPage />}
      {page === 'shipping' && <ShippingPage />}
      {page === 'users' && <UsersPage />}
      {page === 'settings' && <SettingsPage />}
    </DashboardShell>
  )
}
