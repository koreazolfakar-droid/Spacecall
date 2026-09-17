export type PublishStatus = 'draft' | 'published'
export type AdminRole = 'owner' | 'admin' | 'editor' | 'viewer'

export interface AuditFields {
  id: string
  createdAt: string
  updatedAt: string
}

export interface Brand extends AuditFields {
  name: string
  handle: string
  logoUrl: string
  iconUrl: string
  description: string
  active: boolean
  sortOrder: number
}

export interface Collection extends AuditFields {
  name: string
  handle: string
  description: string
  imageUrl: string
  iconUrl: string
  active: boolean
  featured: boolean
  sortOrder: number
  brandIds: string[]
}

export interface ProductVariant {
  id: string
  title: string
  sku: string
  price: number
  compareAtPrice?: number
  stock: number
  color?: string
  storage?: string
  imageUrl?: string
  active: boolean
}

export interface Product extends AuditFields {
  title: string
  handle: string
  subtitle: string
  description: string
  brandId: string
  collectionIds: string[]
  images: string[]
  status: PublishStatus
  featured: boolean
  tags: string[]
  variants: ProductVariant[]
}

export interface MediaAsset extends AuditFields {
  name: string
  url: string
  alt: string
  kind: 'image' | 'icon'
}

export interface NavigationItem extends AuditFields {
  label: string
  url: string
  enabled: boolean
  sortOrder: number
}

export interface AdminUser extends AuditFields {
  name: string
  email: string
  role: AdminRole
  active: boolean
}

export interface SocialLinks {
  instagram: string
  facebook: string
  tiktok: string
  youtube: string
}

export interface GeneralSettings {
  storeName: string
  storeTagline: string
  domain: string
  supportEmail: string
  supportPhone: string
  whatsappNumber: string
  currency: string
  locale: string
}

export interface BrandingSettings {
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  accentColor: string
  darkModeEnabled: boolean
}

export interface HeaderSettings {
  announcementEnabled: boolean
  announcementText: string
  showSearch: boolean
  showWishlist: boolean
  showCompare: boolean
  showThemeToggle: boolean
}

export interface HomepageSettings {
  heroEnabled: boolean
  heroTitle: string
  heroSubtitle: string
  heroImageUrl: string
  heroCtaLabel: string
  heroCtaUrl: string
  showBrands: boolean
  showCollections: boolean
  showBestSellers: boolean
  showNewArrivals: boolean
  showTrustStrip: boolean
}

export interface CatalogSettings {
  lowStockThreshold: number
  showOutOfStock: boolean
  showCompareAtPrice: boolean
  defaultProductSort: 'featured' | 'newest' | 'price-asc' | 'price-desc'
}

export interface SeoSettings {
  defaultTitle: string
  titleTemplate: string
  defaultDescription: string
  ogImageUrl: string
  indexStorefront: boolean
}

export interface FooterSettings {
  description: string
  showNewsletter: boolean
  copyrightText: string
  social: SocialLinks
}

export interface ShippingSettings {
  enabled: boolean
  flatRate: number
  freeShippingThreshold: number
  estimatedDeliveryText: string
}

export interface NotificationSettings {
  orderEmailEnabled: boolean
  lowStockEnabled: boolean
  lowStockEmail: string
}

export interface StoreSettings {
  general: GeneralSettings
  branding: BrandingSettings
  header: HeaderSettings
  homepage: HomepageSettings
  catalog: CatalogSettings
  seo: SeoSettings
  footer: FooterSettings
  shipping: ShippingSettings
  notifications: NotificationSettings
}

export interface SettingsSnapshot {
  draft: StoreSettings
  published: StoreSettings
  lastDraftSavedAt: string | null
  lastPublishedAt: string | null
}

export interface DashboardState {
  schemaVersion: 2
  settings: SettingsSnapshot
  brands: Brand[]
  collections: Collection[]
  products: Product[]
  media: MediaAsset[]
  navigation: NavigationItem[]
  users: AdminUser[]
}
