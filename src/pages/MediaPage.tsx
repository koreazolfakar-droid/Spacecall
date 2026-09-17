import { useMemo, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { dashboardStore, useDashboardStore } from '../store/dashboard-store'

const initialForm = { name: '', url: '', alt: '', kind: 'image' as const }

export function MediaPage() {
  const { media } = useDashboardStore()
  const [form, setForm] = useState(initialForm)
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => media.filter((asset) => `${asset.name} ${asset.alt}`.toLowerCase().includes(query.toLowerCase())), [media, query])

  const submit = () => {
    if (!form.name.trim() || !form.url.trim()) return
    dashboardStore.addMedia(form)
    setForm(initialForm)
  }

  return <section>
    <div className="page-heading"><div><p className="eyebrow">Assets</p><h1>Media Library</h1><p>Centralize reusable product, brand, hero and icon assets before connecting remote storage.</p></div></div>
    <div className="content-grid content-grid--2 content-grid--form">
      <article className="panel">
        <div className="panel-heading"><div><span className="panel-kicker">New asset</span><h2>Add media</h2></div></div>
        <div className="form-grid">
          <label><span>Name</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label><span>Type</span><select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as 'image' | 'icon' })}><option value="image">Image</option><option value="icon">Icon</option></select></label>
          <label className="field-full"><span>URL</span><input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." /></label>
          <label className="field-full"><span>Alt text</span><input value={form.alt} onChange={(e) => setForm({ ...form, alt: e.target.value })} /></label>
        </div>
        <button className="button button--primary" onClick={submit}><ImagePlus size={17} /> Add asset</button>
      </article>

      <article className="panel">
        <div className="panel-heading panel-heading--stack-mobile"><div><span className="panel-kicker">{media.length} assets</span><h2>Library</h2></div><input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search media…" /></div>
        {filtered.length === 0 ? <div className="empty-state">No media assets yet.</div> : <div className="media-grid">{filtered.map((asset) => <div className="media-card" key={asset.id}>
          <div className="media-preview"><img src={asset.url} alt={asset.alt || asset.name} /></div>
          <div className="media-card-copy"><input className="inline-title" value={asset.name} onChange={(e) => dashboardStore.updateMedia(asset.id, { name: e.target.value })} /><span>{asset.kind}</span></div>
          <button className="icon-button danger" onClick={() => dashboardStore.deleteMedia(asset.id)} aria-label={`Delete ${asset.name}`}><Trash2 size={16} /></button>
        </div>)}</div>}
      </article>
    </div>
  </section>
}
