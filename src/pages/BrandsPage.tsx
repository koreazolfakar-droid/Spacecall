import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { dashboardStore, useDashboardStore } from '../store/dashboard-store'

const initialForm = { name: '', logoUrl: '', iconUrl: '', description: '' }

export function BrandsPage() {
  const { brands } = useDashboardStore()
  const [form, setForm] = useState(initialForm)

  const submit = () => {
    if (!form.name.trim()) return
    dashboardStore.addBrand(form)
    setForm(initialForm)
  }

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">Catalog</p><h1>Brands</h1><p>Create brands once, then reuse them across products and collections.</p></div>
      </div>

      <div className="content-grid content-grid--2 content-grid--form">
        <article className="panel">
          <div className="panel-heading"><div><span className="panel-kicker">New brand</span><h2>Add company</h2></div></div>
          <div className="form-grid">
            <label><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Apple" /></label>
            <label><span>Logo URL</span><input value={form.logoUrl} onChange={(event) => setForm({ ...form, logoUrl: event.target.value })} placeholder="https://..." /></label>
            <label><span>Icon URL</span><input value={form.iconUrl} onChange={(event) => setForm({ ...form, iconUrl: event.target.value })} placeholder="https://..." /></label>
            <label className="field-full"><span>Description</span><textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Short brand description" /></label>
          </div>
          <button className="button button--primary" onClick={submit}><Plus size={17} /> Add brand</button>
        </article>

        <article className="panel">
          <div className="panel-heading"><div><span className="panel-kicker">{brands.length} total</span><h2>Brand library</h2></div></div>
          {brands.length === 0 ? (
            <div className="empty-state">No brands yet. Add your first brand from the form.</div>
          ) : (
            <div className="entity-list">
              {brands.map((brand) => (
                <div className="entity-row" key={brand.id}>
                  <div className="entity-thumb">{brand.logoUrl ? <img src={brand.logoUrl} alt="" /> : brand.name.slice(0, 2).toUpperCase()}</div>
                  <div className="entity-main">
                    <input className="inline-title" value={brand.name} onChange={(event) => dashboardStore.updateBrand(brand.id, { name: event.target.value })} />
                    <span>/{brand.handle}</span>
                  </div>
                  <label className="switch-row compact"><input type="checkbox" checked={brand.active} onChange={(event) => dashboardStore.updateBrand(brand.id, { active: event.target.checked })} /><span>Active</span></label>
                  <button className="icon-button danger" onClick={() => dashboardStore.deleteBrand(brand.id)} aria-label={`Delete ${brand.name}`}><Trash2 size={17} /></button>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
