import { useSyncExternalStore } from 'react'
import { defaultDashboardState, defaultSettings } from '../data/defaults'
import type { Brand, Collection, DashboardState, Product, StoreSettings } from '../types'

const STORAGE_KEY = 'spacecall.dashboard.v1'

type Listener = () => void

const clone = <T,>(value: T): T => structuredClone(value)

function makeId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function loadInitialState(): DashboardState {
  if (typeof window === 'undefined') return clone(defaultDashboardState)

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return clone(defaultDashboardState)
    const parsed = JSON.parse(raw) as DashboardState
    if (parsed.schemaVersion !== 1) return clone(defaultDashboardState)
    return parsed
  } catch {
    return clone(defaultDashboardState)
  }
}

let state = loadInitialState()
const listeners = new Set<Listener>()

function persist() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}

function emit() {
  persist()
  listeners.forEach((listener) => listener())
}

function setState(next: DashboardState) {
  state = next
  emit()
}

function updateState(recipe: (draft: DashboardState) => void) {
  const draft = clone(state)
  recipe(draft)
  setState(draft)
}

export const dashboardStore = {
  subscribe(listener: Listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  getSnapshot() {
    return state
  },

  updateDraftSettings(next: StoreSettings) {
    updateState((draft) => {
      draft.settings.draft = clone(next)
    })
  },

  saveDraft() {
    updateState((draft) => {
      draft.settings.lastDraftSavedAt = new Date().toISOString()
    })
  },

  publishSettings() {
    updateState((draft) => {
      draft.settings.published = clone(draft.settings.draft)
      const now = new Date().toISOString()
      draft.settings.lastDraftSavedAt = now
      draft.settings.lastPublishedAt = now
    })
  },

  discardDraft() {
    updateState((draft) => {
      draft.settings.draft = clone(draft.settings.published)
      draft.settings.lastDraftSavedAt = null
    })
  },

  resetSettings() {
    updateState((draft) => {
      draft.settings.draft = clone(defaultSettings)
    })
  },

  addBrand(input: Pick<Brand, 'name' | 'logoUrl' | 'iconUrl' | 'description'>) {
    const now = new Date().toISOString()
    updateState((draft) => {
      draft.brands.push({
        id: makeId('brand'),
        name: input.name.trim(),
        handle: slugify(input.name),
        logoUrl: input.logoUrl.trim(),
        iconUrl: input.iconUrl.trim(),
        description: input.description.trim(),
        active: true,
        sortOrder: draft.brands.length,
        createdAt: now,
        updatedAt: now,
      })
    })
  },

  updateBrand(id: string, patch: Partial<Omit<Brand, 'id' | 'createdAt'>>) {
    updateState((draft) => {
      const brand = draft.brands.find((item) => item.id === id)
      if (!brand) return
      Object.assign(brand, patch, { updatedAt: new Date().toISOString() })
      if (patch.name) brand.handle = slugify(patch.name)
    })
  },

  deleteBrand(id: string) {
    updateState((draft) => {
      draft.brands = draft.brands.filter((item) => item.id !== id)
      draft.collections.forEach((collection) => {
        collection.brandIds = collection.brandIds.filter((brandId) => brandId !== id)
      })
      draft.products.forEach((product) => {
        if (product.brandId === id) product.brandId = ''
      })
    })
  },

  addCollection(input: Pick<Collection, 'name' | 'description' | 'imageUrl' | 'iconUrl'>) {
    const now = new Date().toISOString()
    updateState((draft) => {
      draft.collections.push({
        id: makeId('collection'),
        name: input.name.trim(),
        handle: slugify(input.name),
        description: input.description.trim(),
        imageUrl: input.imageUrl.trim(),
        iconUrl: input.iconUrl.trim(),
        active: true,
        featured: false,
        sortOrder: draft.collections.length,
        brandIds: [],
        createdAt: now,
        updatedAt: now,
      })
    })
  },

  updateCollection(id: string, patch: Partial<Omit<Collection, 'id' | 'createdAt'>>) {
    updateState((draft) => {
      const collection = draft.collections.find((item) => item.id === id)
      if (!collection) return
      Object.assign(collection, patch, { updatedAt: new Date().toISOString() })
      if (patch.name) collection.handle = slugify(patch.name)
    })
  },

  deleteCollection(id: string) {
    updateState((draft) => {
      draft.collections = draft.collections.filter((item) => item.id !== id)
      draft.products.forEach((product) => {
        product.collectionIds = product.collectionIds.filter((collectionId) => collectionId !== id)
      })
    })
  },

  addProduct(input: Pick<Product, 'title' | 'subtitle' | 'description' | 'brandId' | 'collectionIds' | 'images'>) {
    const now = new Date().toISOString()
    updateState((draft) => {
      draft.products.push({
        id: makeId('product'),
        title: input.title.trim(),
        handle: slugify(input.title),
        subtitle: input.subtitle.trim(),
        description: input.description.trim(),
        brandId: input.brandId,
        collectionIds: input.collectionIds,
        images: input.images.filter(Boolean),
        status: 'draft',
        featured: false,
        tags: [],
        variants: [
          {
            id: makeId('variant'),
            title: 'Default',
            sku: '',
            price: 0,
            stock: 0,
            active: true,
          },
        ],
        createdAt: now,
        updatedAt: now,
      })
    })
  },

  updateProduct(id: string, patch: Partial<Omit<Product, 'id' | 'createdAt'>>) {
    updateState((draft) => {
      const product = draft.products.find((item) => item.id === id)
      if (!product) return
      Object.assign(product, patch, { updatedAt: new Date().toISOString() })
      if (patch.title) product.handle = slugify(patch.title)
    })
  },

  deleteProduct(id: string) {
    updateState((draft) => {
      draft.products = draft.products.filter((item) => item.id !== id)
    })
  },

  resetAll() {
    setState(clone(defaultDashboardState))
  },
}

export function useDashboardStore() {
  return useSyncExternalStore(dashboardStore.subscribe, dashboardStore.getSnapshot, dashboardStore.getSnapshot)
}
