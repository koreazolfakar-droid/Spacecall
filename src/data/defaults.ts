import type { DashboardState, StoreSettings } from '../types'

export const defaultSettings: StoreSettings = {
  general: {
    storeName: 'Space Call',
    storeTagline: 'Premium mobile & electronics store',
    domain: 'spacecallapp.store',
    supportEmail: '',
    supportPhone: '',
    whatsappNumber: '',
    currency: 'USD',
    locale: 'en-LB',
  },
  branding: {
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#111111',
    accentColor: '#6c5ce7',
    darkModeEnabled: true,
  },
  header: {
    announcementEnabled: true,
    announcementText: 'Welcome to Space Call',
    showSearch: true,
    showWishlist: true,
    showCompare: true,
    showThemeToggle: true,
  },
  homepage: {
    heroEnabled: true,
    heroTitle: 'Latest technology. Better choices.',
    heroSubtitle: 'Discover phones, tablets, accessories and more.',
    heroImageUrl: '',
    heroCtaLabel: 'Shop now',
    heroCtaUrl: '/collections/all',
    showBrands: true,
    showCollections: true,
    showBestSellers: true,
    showNewArrivals: true,
    showTrustStrip: true,
  },
  catalog: {
    lowStockThreshold: 5,
    showOutOfStock: true,
    showCompareAtPrice: true,
    defaultProductSort: 'featured',
  },
  seo: {
    defaultTitle: 'Space Call | Phones & Electronics',
    titleTemplate: '%s | Space Call',
    defaultDescription: 'Shop phones, tablets, accessories and electronics from Space Call.',
    ogImageUrl: '',
    indexStorefront: true,
  },
  footer: {
    description: 'Space Call — your destination for mobile technology and electronics.',
    showNewsletter: true,
    copyrightText: '© Space Call. All rights reserved.',
    social: {
      instagram: '',
      facebook: '',
      tiktok: '',
      youtube: '',
    },
  },
  shipping: {
    enabled: true,
    flatRate: 3,
    freeShippingThreshold: 100,
    estimatedDeliveryText: 'Delivery time varies by area.',
  },
  notifications: {
    orderEmailEnabled: true,
    lowStockEnabled: true,
    lowStockEmail: '',
  },
}

export const defaultDashboardState: DashboardState = {
  schemaVersion: 1,
  settings: {
    draft: structuredClone(defaultSettings),
    published: structuredClone(defaultSettings),
    lastDraftSavedAt: null,
    lastPublishedAt: null,
  },
  brands: [],
  collections: [],
  products: [],
}
