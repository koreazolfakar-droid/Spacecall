import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { dashboardStore, useDashboardStore } from '../store/dashboard-store'

const initialForm = { name: '', description: '', imageUrl: '', iconUrl: '' }

export function CollectionsPage() {
  const { collections } = useDashboardStore()
  const [form, setForm] = useState(initialForm)

  const submit = () => {
    if (!form.name.trim()) return
    dashboardStore.addCollection(form)
    setForm(initialForm)
  }

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">Catalog</p><h1>Collections</h1><p>Build reusable product groups for homepage sections, menus and campaigns.</p></div>
      </div>

      <div className="content-grid content-grid--2 content-grid--form">
        <article className="panel">
          <div className="panel-heading"><div><span className="panel-kicker">New collection</span><h2>Create collection</h2></div></div>
          <div className="form-grid">
            <label><span>Name</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="iPhone" /></label>
            <label><span>Image URL</span><input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="https://..." /></label>
            <label><span>Icon URL</span><input value={form.iconUrl} onChange={(event) => setForm({ ...form, iconUrl: event.target.value })} placeholder="https://..." /></label>
            <label className="field-full"><span>Description</span><textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          </div>
          <button className="button button--primary" onClick={submit}><Plus size={17} /> Add collection</button>
        </article>

        <article className="panel">
          <div className="panel-heading"><div><span className="panel-kicker">{collections.length} total</span><h2>Collection library</h2></div></div>
          {collections.length === 0 ? <div className="empty-state">No collections yet.</div> : (
            <div className="entity-list">
              {collections.map((collection) => (
                <div className="entity-row" key={collection.id}>
                  <div className="entity-thumb">{collection.imageUrl ? <img src={collection.imageUrl} alt="" /> : collection.name.slice(0, 2).toUpperCase()}</div>
                  <div className="entity-main">
                    <input className="inline-title" value={collection.name} onChange={(event) => dashboardStore.updateCollection(collection.id, { name: event.target.value })} />
                    <span>/{collection.handle}</span>
                  </div>
                  <label className="switch-row compact"><input type="checkbox" checked={collection.featured} onChange={(event) => dashboardStore.updateCollection(collection.id, { featured: event.target.checked })} /><span>Featured</span></label>
                  <label className="switch-row compact"><input type="checkbox" checked={collection.active} onChange={(event) => dashboardStore.updateCollection(collection.id, { active: event.target.checked })} /><span>Active</span></label>
                  <button className="icon-button danger" onClick={() => dashboardStore.deleteCollection(collection.id)} aria-label={`Delete ${collection.name}`}><Trash2 size={17} /></button>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
