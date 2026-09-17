import { Save } from 'lucide-react'
import { dashboardStore, useDashboardStore } from '../store/dashboard-store'

export function ShippingPage() {
  const { settings } = useDashboardStore()
  const shipping = settings.draft.shipping

  const patch = (nextPatch: Partial<typeof shipping>) => {
    dashboardStore.updateDraftSettings({
      ...settings.draft,
      shipping: { ...shipping, ...nextPatch },
    })
  }

  return <section>
    <div className="page-heading page-heading--actions">
      <div><p className="eyebrow">Operations</p><h1>Shipping</h1><p>Configure delivery defaults in the same draft/publish settings system.</p></div>
      <button className="button button--primary" onClick={() => dashboardStore.saveDraft()}><Save size={16} /> Save draft</button>
    </div>
    <article className="panel settings-panel">
      <div className="panel-heading settings-heading"><div><span className="panel-kicker">Delivery</span><h2>Default shipping rules</h2><p>These become the base contract for checkout and backend shipping zones.</p></div></div>
      <div className="form-grid">
        <label><span>Flat rate</span><input type="number" min="0" step="0.01" value={shipping.flatRate} onChange={(e) => patch({ flatRate: Math.max(0, Number(e.target.value) || 0) })} /></label>
        <label><span>Free shipping threshold</span><input type="number" min="0" step="0.01" value={shipping.freeShippingThreshold} onChange={(e) => patch({ freeShippingThreshold: Math.max(0, Number(e.target.value) || 0) })} /></label>
        <label className="field-full"><span>Estimated delivery text</span><input value={shipping.estimatedDeliveryText} onChange={(e) => patch({ estimatedDeliveryText: e.target.value })} /></label>
      </div>
      <label className="switch-row"><input type="checkbox" checked={shipping.enabled} onChange={(e) => patch({ enabled: e.target.checked })} /><span>Shipping enabled</span></label>
    </article>
  </section>
}
