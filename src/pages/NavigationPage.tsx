import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { dashboardStore, useDashboardStore } from '../store/dashboard-store'

export function NavigationPage() {
  const { navigation } = useDashboardStore()
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const ordered = useMemo(() => [...navigation].sort((a, b) => a.sortOrder - b.sortOrder), [navigation])

  const add = () => {
    if (!label.trim() || !url.trim()) return
    dashboardStore.addNavigationItem(label, url)
    setLabel('')
    setUrl('')
  }

  return <section>
    <div className="page-heading"><div><p className="eyebrow">Store structure</p><h1>Navigation Builder</h1><p>Create, reorder and enable storefront menu links without editing code.</p></div></div>
    <div className="content-grid content-grid--2 content-grid--form">
      <article className="panel">
        <div className="panel-heading"><div><span className="panel-kicker">New link</span><h2>Add menu item</h2></div></div>
        <div className="form-grid">
          <label><span>Label</span><input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Accessories" /></label>
          <label><span>URL</span><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/collections/accessories" /></label>
        </div>
        <button className="button button--primary" onClick={add}><Plus size={17} /> Add link</button>
      </article>
      <article className="panel">
        <div className="panel-heading"><div><span className="panel-kicker">{ordered.length} links</span><h2>Main menu</h2></div></div>
        <div className="entity-list">
          {ordered.map((item, index) => <div className="entity-row" key={item.id}>
            <div className="order-controls"><button className="icon-button" disabled={index === 0} onClick={() => dashboardStore.moveNavigationItem(item.id, -1)}><ArrowUp size={15} /></button><button className="icon-button" disabled={index === ordered.length - 1} onClick={() => dashboardStore.moveNavigationItem(item.id, 1)}><ArrowDown size={15} /></button></div>
            <div className="entity-main"><input className="inline-title" value={item.label} onChange={(e) => dashboardStore.updateNavigationItem(item.id, { label: e.target.value })} /><input className="inline-subtitle" value={item.url} onChange={(e) => dashboardStore.updateNavigationItem(item.id, { url: e.target.value })} /></div>
            <label className="switch-row compact"><input type="checkbox" checked={item.enabled} onChange={(e) => dashboardStore.updateNavigationItem(item.id, { enabled: e.target.checked })} /><span>Enabled</span></label>
            <button className="icon-button danger" onClick={() => dashboardStore.deleteNavigationItem(item.id)}><Trash2 size={16} /></button>
          </div>)}
        </div>
      </article>
    </div>
  </section>
}
