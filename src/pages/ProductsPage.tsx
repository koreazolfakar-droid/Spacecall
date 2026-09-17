import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { dashboardStore, useDashboardStore } from '../store/dashboard-store'

const initialForm = {
  title: '',
  subtitle: '',
  description: '',
  brandId: '',
  collectionId: '',
  imageUrl: '',
}

export function ProductsPage() {
  const { products, brands, collections } = useDashboardStore()
  const [form, setForm] = useState(initialForm)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return products
    return products.filter((product) =>
      [product.title, product.subtitle, product.handle].some((value) => value.toLowerCase().includes(query)),
    )
  }, [products, search])

  const submit = () => {
    if (!form.title.trim()) return
    dashboardStore.addProduct({
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      brandId: form.brandId,
      collectionIds: form.collectionId ? [form.collectionId] : [],
      images: form.imageUrl ? [form.imageUrl] : [],
    })
    setForm(initialForm)
  }

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">Catalog</p><h1>Products & inventory</h1><p>Create products, assign brands and collections, then control price and stock from one place.</p></div>
      </div>

      <div className="content-grid content-grid--2 content-grid--form">
        <article className="panel">
          <div className="panel-heading"><div><span className="panel-kicker">New product</span><h2>Product basics</h2></div></div>
          <div className="form-grid">
            <label><span>Title</span><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="iPhone 18 Pro" /></label>
            <label><span>Subtitle</span><input value={form.subtitle} onChange={(event) => setForm({ ...form, subtitle: event.target.value })} placeholder="256GB · Titanium" /></label>
            <label><span>Brand</span><select value={form.brandId} onChange={(event) => setForm({ ...form, brandId: event.target.value })}><option value="">No brand</option>{brands.map((brand) => <option key={brand.id} value={brand.id}>{brand.name}</option>)}</select></label>
            <label><span>Collection</span><select value={form.collectionId} onChange={(event) => setForm({ ...form, collectionId: event.target.value })}><option value="">No collection</option>{collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>)}</select></label>
            <label className="field-full"><span>Primary image URL</span><input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="https://..." /></label>
            <label className="field-full"><span>Description</span><textarea rows={5} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          </div>
          <button className="button button--primary" onClick={submit}><Plus size={17} /> Add product</button>
        </article>

        <article className="panel">
          <div className="panel-heading panel-heading--stack-mobile">
            <div><span className="panel-kicker">{products.length} total</span><h2>Product list</h2></div>
            <input className="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products…" />
          </div>
          {filtered.length === 0 ? <div className="empty-state">No products match this view.</div> : (
            <div className="product-list">
              {filtered.map((product) => {
                const variant = product.variants[0]
                const brand = brands.find((item) => item.id === product.brandId)
                return (
                  <div className="product-row" key={product.id}>
                    <div className="entity-thumb entity-thumb--product">{product.images[0] ? <img src={product.images[0]} alt="" /> : product.title.slice(0, 2).toUpperCase()}</div>
                    <div className="product-copy">
                      <input className="inline-title" value={product.title} onChange={(event) => dashboardStore.updateProduct(product.id, { title: event.target.value })} />
                      <span>{brand?.name ?? 'No brand'} · /{product.handle}</span>
                    </div>
                    <label className="mini-field"><span>Price</span><input type="number" min="0" step="0.01" value={variant.price} onChange={(event) => dashboardStore.updateProduct(product.id, { variants: [{ ...variant, price: Number(event.target.value) }] })} /></label>
                    <label className="mini-field"><span>Stock</span><input type="number" min="0" step="1" value={variant.stock} onChange={(event) => dashboardStore.updateProduct(product.id, { variants: [{ ...variant, stock: Number(event.target.value) }] })} /></label>
                    <select className="status-select" value={product.status} onChange={(event) => dashboardStore.updateProduct(product.id, { status: event.target.value as 'draft' | 'published' })}><option value="draft">Draft</option><option value="published">Published</option></select>
                    <button className="icon-button danger" onClick={() => dashboardStore.deleteProduct(product.id)} aria-label={`Delete ${product.title}`}><Trash2 size={17} /></button>
                  </div>
                )
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}
