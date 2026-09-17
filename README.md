# Space Call Admin Dashboard

Independent administration workspace for Space Call.

## Current foundation

- React + TypeScript + Vite
- Responsive admin shell
- Versioned local dashboard state
- Draft / published settings workflow
- Product and inventory management
- Brand management
- Collection management
- Media library
- Navigation builder with ordering
- Shipping settings
- User / role staging
- SEO, branding, header, homepage, footer and notification settings
- GitHub Actions typecheck + build verification

## Important architecture rule

This repository is intentionally independent from the live Space Call storefront. The current persistence adapter is browser local storage for safe standalone testing. Shopify, Supabase or another backend should be connected through a dedicated data adapter/API layer after the Dashboard flows are validated.

The Users & Roles screen currently stores configuration only. Real access control must be enforced server-side once authentication is connected.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run typecheck
npm run build
```
