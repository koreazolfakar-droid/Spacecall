import { useMemo, useState } from 'react'
import { RotateCcw, Save, Send, Undo2 } from 'lucide-react'
import { dashboardStore, useDashboardStore } from '../store/dashboard-store'
import type { StoreSettings } from '../types'

type SectionKey = keyof StoreSettings

const sectionLabels: Record<SectionKey, string> = {
  general: 'General',
  branding: 'Branding & theme',
  header: 'Header',
  homepage: 'Homepage & hero',
  catalog: 'Catalog',
  seo: 'SEO',
  footer: 'Footer & social',
  shipping: 'Shipping',
  notifications: 'Notifications',
}

export function SettingsPage() {
  const { settings } = useDashboardStore()
  const [active, setActive] = useState<SectionKey>('general')
  const [query, setQuery] = useState('')
  const draft = settings.draft

  const sections = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const entries = Object.entries(sectionLabels) as Array<[SectionKey, string]>
    return normalized ? entries.filter(([, label]) => label.toLowerCase().includes(normalized)) : entries
  }, [query])

  const updateSection = <K extends SectionKey>(section: K, patch: Partial<StoreSettings[K]>) => {
    const next = structuredClone(draft)
    next[section] = { ...next[section], ...patch }
    dashboardStore.updateDraftSettings(next)
  }

  const updateSocial = (key: keyof StoreSettings['footer']['social'], value: string) => {
    updateSection('footer', { social: { ...draft.footer.social, [key]: value } })
  }

  const hasChanges = JSON.stringify(settings.draft) !== JSON.stringify(settings.published)

  return (
    <section>
      <div className="page-heading page-heading--actions">
        <div><p className="eyebrow">Store configuration</p><h1>Settings</h1><p>Edit safely in draft mode, then publish only when the configuration is ready.</p></div>
        <div className="action-row">
          <button className="button" onClick={() => dashboardStore.discardDraft()} disabled={!hasChanges}><Undo2 size={16} /> Discard</button>
          <button className="button" onClick={() => dashboardStore.resetSettings()}><RotateCcw size={16} /> Reset draft</button>
          <button className="button" onClick={() => dashboardStore.saveDraft()}><Save size={16} /> Save draft</button>
          <button className="button button--primary" onClick={() => dashboardStore.publishSettings()}><Send size={16} /> Publish</button>
        </div>
      </div>

      <div className="settings-statusbar">
        <span className={`status-pill ${hasChanges ? 'status-pill--warning' : 'status-pill--ok'}`}>{hasChanges ? 'Unpublished changes' : 'Draft matches published'}</span>
        <span>Draft: {settings.lastDraftSavedAt ? new Date(settings.lastDraftSavedAt).toLocaleString() : 'not saved'}</span>
        <span>Published: {settings.lastPublishedAt ? new Date(settings.lastPublishedAt).toLocaleString() : 'not published'}</span>
      </div>

      <div className="settings-layout">
        <aside className="settings-nav panel">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a setting…" />
          <div>
            {sections.map(([key, label]) => <button key={key} className={active === key ? 'active' : ''} onClick={() => setActive(key)}>{label}</button>)}
          </div>
        </aside>

        <div className="panel settings-panel">
          {active === 'general' && <>
            <SettingsHeader title="General" description="Core store identity and contact details." />
            <div className="form-grid">
              <Field label="Store name" value={draft.general.storeName} onChange={(value) => updateSection('general', { storeName: value })} />
              <Field label="Tagline" value={draft.general.storeTagline} onChange={(value) => updateSection('general', { storeTagline: value })} />
              <Field label="Domain" value={draft.general.domain} onChange={(value) => updateSection('general', { domain: value })} />
              <Field label="Support email" type="email" value={draft.general.supportEmail} onChange={(value) => updateSection('general', { supportEmail: value })} />
              <Field label="Support phone" value={draft.general.supportPhone} onChange={(value) => updateSection('general', { supportPhone: value })} />
              <Field label="WhatsApp number" value={draft.general.whatsappNumber} onChange={(value) => updateSection('general', { whatsappNumber: value })} />
              <Field label="Currency" value={draft.general.currency} onChange={(value) => updateSection('general', { currency: value })} />
              <Field label="Locale" value={draft.general.locale} onChange={(value) => updateSection('general', { locale: value })} />
            </div>
          </>}

          {active === 'branding' && <>
            <SettingsHeader title="Branding & theme" description="Store identity shared by the future storefront integration." />
            <div className="form-grid">
              <Field label="Logo URL" value={draft.branding.logoUrl} onChange={(value) => updateSection('branding', { logoUrl: value })} />
              <Field label="Favicon URL" value={draft.branding.faviconUrl} onChange={(value) => updateSection('branding', { faviconUrl: value })} />
              <Field label="Primary color" type="color" value={draft.branding.primaryColor} onChange={(value) => updateSection('branding', { primaryColor: value })} />
              <Field label="Accent color" type="color" value={draft.branding.accentColor} onChange={(value) => updateSection('branding', { accentColor: value })} />
            </div>
            <Toggle label="Allow dark mode" checked={draft.branding.darkModeEnabled} onChange={(checked) => updateSection('branding', { darkModeEnabled: checked })} />
            <PreviewCard logoUrl={draft.branding.logoUrl} storeName={draft.general.storeName} primary={draft.branding.primaryColor} accent={draft.branding.accentColor} />
          </>}

          {active === 'header' && <>
            <SettingsHeader title="Header" description="Visibility and announcement controls." />
            <Field label="Announcement text" value={draft.header.announcementText} onChange={(value) => updateSection('header', { announcementText: value })} />
            <div className="toggle-grid">
              <Toggle label="Announcement bar" checked={draft.header.announcementEnabled} onChange={(checked) => updateSection('header', { announcementEnabled: checked })} />
              <Toggle label="Search" checked={draft.header.showSearch} onChange={(checked) => updateSection('header', { showSearch: checked })} />
              <Toggle label="Wishlist" checked={draft.header.showWishlist} onChange={(checked) => updateSection('header', { showWishlist: checked })} />
              <Toggle label="Compare" checked={draft.header.showCompare} onChange={(checked) => updateSection('header', { showCompare: checked })} />
              <Toggle label="Theme toggle" checked={draft.header.showThemeToggle} onChange={(checked) => updateSection('header', { showThemeToggle: checked })} />
            </div>
          </>}

          {active === 'homepage' && <>
            <SettingsHeader title="Homepage & hero" description="Control important homepage sections without editing storefront code." />
            <div className="form-grid">
              <Field label="Hero title" value={draft.homepage.heroTitle} onChange={(value) => updateSection('homepage', { heroTitle: value })} />
              <Field label="Hero subtitle" value={draft.homepage.heroSubtitle} onChange={(value) => updateSection('homepage', { heroSubtitle: value })} />
              <Field label="Hero image URL" value={draft.homepage.heroImageUrl} onChange={(value) => updateSection('homepage', { heroImageUrl: value })} />
              <Field label="CTA label" value={draft.homepage.heroCtaLabel} onChange={(value) => updateSection('homepage', { heroCtaLabel: value })} />
              <Field label="CTA URL" value={draft.homepage.heroCtaUrl} onChange={(value) => updateSection('homepage', { heroCtaUrl: value })} />
            </div>
            <div className="toggle-grid">
              <Toggle label="Hero" checked={draft.homepage.heroEnabled} onChange={(checked) => updateSection('homepage', { heroEnabled: checked })} />
              <Toggle label="Brands" checked={draft.homepage.showBrands} onChange={(checked) => updateSection('homepage', { showBrands: checked })} />
              <Toggle label="Collections" checked={draft.homepage.showCollections} onChange={(checked) => updateSection('homepage', { showCollections: checked })} />
              <Toggle label="Best sellers" checked={draft.homepage.showBestSellers} onChange={(checked) => updateSection('homepage', { showBestSellers: checked })} />
              <Toggle label="New arrivals" checked={draft.homepage.showNewArrivals} onChange={(checked) => updateSection('homepage', { showNewArrivals: checked })} />
              <Toggle label="Trust strip" checked={draft.homepage.showTrustStrip} onChange={(checked) => updateSection('homepage', { showTrustStrip: checked })} />
            </div>
          </>}

          {active === 'catalog' && <>
            <SettingsHeader title="Catalog" description="Inventory and storefront catalog behavior." />
            <div className="form-grid">
              <Field label="Low stock threshold" type="number" value={String(draft.catalog.lowStockThreshold)} onChange={(value) => updateSection('catalog', { lowStockThreshold: Math.max(0, Number(value) || 0) })} />
              <label><span>Default sort</span><select value={draft.catalog.defaultProductSort} onChange={(event) => updateSection('catalog', { defaultProductSort: event.target.value as StoreSettings['catalog']['defaultProductSort'] })}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></label>
            </div>
            <div className="toggle-grid">
              <Toggle label="Show out-of-stock products" checked={draft.catalog.showOutOfStock} onChange={(checked) => updateSection('catalog', { showOutOfStock: checked })} />
              <Toggle label="Show compare-at price" checked={draft.catalog.showCompareAtPrice} onChange={(checked) => updateSection('catalog', { showCompareAtPrice: checked })} />
            </div>
          </>}

          {active === 'seo' && <>
            <SettingsHeader title="SEO" description="Defaults for search engines and social sharing." />
            <div className="form-grid">
              <Field label="Default title" value={draft.seo.defaultTitle} onChange={(value) => updateSection('seo', { defaultTitle: value })} />
              <Field label="Title template" value={draft.seo.titleTemplate} onChange={(value) => updateSection('seo', { titleTemplate: value })} />
              <label className="field-full"><span>Default description</span><textarea rows={4} value={draft.seo.defaultDescription} onChange={(event) => updateSection('seo', { defaultDescription: event.target.value })} /></label>
              <Field label="OG image URL" value={draft.seo.ogImageUrl} onChange={(value) => updateSection('seo', { ogImageUrl: value })} />
            </div>
            <Toggle label="Allow storefront indexing" checked={draft.seo.indexStorefront} onChange={(checked) => updateSection('seo', { indexStorefront: checked })} />
            <div className="search-preview"><span>{draft.general.domain}</span><strong>{draft.seo.defaultTitle}</strong><p>{draft.seo.defaultDescription}</p></div>
          </>}

          {active === 'footer' && <>
            <SettingsHeader title="Footer & social" description="Footer copy and social profiles." />
            <div className="form-grid">
              <Field label="Footer description" value={draft.footer.description} onChange={(value) => updateSection('footer', { description: value })} />
              <Field label="Copyright" value={draft.footer.copyrightText} onChange={(value) => updateSection('footer', { copyrightText: value })} />
              <Field label="Instagram" value={draft.footer.social.instagram} onChange={(value) => updateSocial('instagram', value)} />
              <Field label="Facebook" value={draft.footer.social.facebook} onChange={(value) => updateSocial('facebook', value)} />
              <Field label="TikTok" value={draft.footer.social.tiktok} onChange={(value) => updateSocial('tiktok', value)} />
              <Field label="YouTube" value={draft.footer.social.youtube} onChange={(value) => updateSocial('youtube', value)} />
            </div>
            <Toggle label="Newsletter signup" checked={draft.footer.showNewsletter} onChange={(checked) => updateSection('footer', { showNewsletter: checked })} />
          </>}

          {active === 'shipping' && <>
            <SettingsHeader title="Shipping" description="Basic delivery configuration for the future checkout integration." />
            <div className="form-grid">
              <Field label="Flat rate" type="number" value={String(draft.shipping.flatRate)} onChange={(value) => updateSection('shipping', { flatRate: Math.max(0, Number(value) || 0) })} />
              <Field label="Free shipping threshold" type="number" value={String(draft.shipping.freeShippingThreshold)} onChange={(value) => updateSection('shipping', { freeShippingThreshold: Math.max(0, Number(value) || 0) })} />
              <Field label="Delivery text" value={draft.shipping.estimatedDeliveryText} onChange={(value) => updateSection('shipping', { estimatedDeliveryText: value })} />
            </div>
            <Toggle label="Shipping enabled" checked={draft.shipping.enabled} onChange={(checked) => updateSection('shipping', { enabled: checked })} />
          </>}

          {active === 'notifications' && <>
            <SettingsHeader title="Notifications" description="Prepare operational alerts before backend email integration." />
            <Field label="Low stock email" type="email" value={draft.notifications.lowStockEmail} onChange={(value) => updateSection('notifications', { lowStockEmail: value })} />
            <div className="toggle-grid">
              <Toggle label="Order emails" checked={draft.notifications.orderEmailEnabled} onChange={(checked) => updateSection('notifications', { orderEmailEnabled: checked })} />
              <Toggle label="Low-stock alerts" checked={draft.notifications.lowStockEnabled} onChange={(checked) => updateSection('notifications', { lowStockEnabled: checked })} />
            </div>
          </>}
        </div>
      </div>
    </section>
  )
}

function SettingsHeader({ title, description }: { title: string; description: string }) {
  return <div className="panel-heading settings-heading"><div><span className="panel-kicker">Settings</span><h2>{title}</h2><p>{description}</p></div></div>
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="switch-row"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span></label>
}

function PreviewCard({ logoUrl, storeName, primary, accent }: { logoUrl: string; storeName: string; primary: string; accent: string }) {
  return <div className="brand-preview" style={{ borderColor: accent }}><div className="brand-preview-mark" style={{ background: primary }}>{logoUrl ? <img src={logoUrl} alt="" /> : 'SC'}</div><div><span>Store identity preview</span><strong>{storeName || 'Space Call'}</strong></div></div>
}
