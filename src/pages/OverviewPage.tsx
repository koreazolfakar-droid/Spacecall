import { AlertTriangle, Boxes, FolderKanban, Package, Tags } from 'lucide-react'
import { useDashboardStore } from '../store/dashboard-store'

export function OverviewPage() {
  const state = useDashboardStore()
  const totalStock = state.products.reduce(
    (sum, product) => sum + product.variants.reduce((variantSum, variant) => variantSum + variant.stock, 0),
    0,
  )
  const lowStock = state.products.filter((product) =>
    product.variants.some((variant) => variant.stock <= state.settings.draft.catalog.lowStockThreshold),
  ).length

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Store control center</h1>
          <p>Build and validate the admin foundation before connecting it to the live storefront.</p>
        </div>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <Package size={20} />
          <div><span>Products</span><strong>{state.products.length}</strong></div>
        </article>
        <article className="stat-card">
          <Tags size={20} />
          <div><span>Brands</span><strong>{state.brands.length}</strong></div>
        </article>
        <article className="stat-card">
          <FolderKanban size={20} />
          <div><span>Collections</span><strong>{state.collections.length}</strong></div>
        </article>
        <article className="stat-card">
          <Boxes size={20} />
          <div><span>Total stock</span><strong>{totalStock}</strong></div>
        </article>
      </div>

      <div className="content-grid content-grid--2">
        <article className="panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">Publishing</span><h2>Settings status</h2></div>
          </div>
          <div className="status-list">
            <div><span>Draft saved</span><strong>{state.settings.lastDraftSavedAt ? new Date(state.settings.lastDraftSavedAt).toLocaleString() : 'Not yet'}</strong></div>
            <div><span>Last published</span><strong>{state.settings.lastPublishedAt ? new Date(state.settings.lastPublishedAt).toLocaleString() : 'Not yet'}</strong></div>
            <div><span>Live data source</span><strong>Not connected</strong></div>
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">Inventory</span><h2>Attention needed</h2></div>
          </div>
          <div className="attention-card">
            <AlertTriangle size={22} />
            <div><strong>{lowStock} low-stock products</strong><span>Threshold: {state.settings.draft.catalog.lowStockThreshold} units</span></div>
          </div>
        </article>
      </div>
    </section>
  )
}
