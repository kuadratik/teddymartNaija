# Next.js App Router Migration Guide

## Overview

This project is being migrated from Pages Router to App Router (Next.js 13+). This document outlines the migration strategy, patterns, and progress.

## Migration Status

### ✅ Completed

1. **Root Layout** (`src/app/layout.tsx`)

   - Migrated `_app.tsx` and `_document.tsx` logic
   - Added global providers (Redux, GoogleOAuth, ConfigProvider)
   - Integrated scripts (GTM, Google Analytics, Clarity, etc.)
   - Set up global metadata

2. **Providers** (`src/app/providers.tsx`)

   - Client-side providers component
   - Geolocation logic
   - Country detection
   - Clip-Uid initialization
   - Toast notifications

3. **Homepage** (`src/app/page.tsx`)

   - Migrated from `src/pages/index.tsx`
   - Using CustomerLayout wrapper

4. **Error Pages**

   - `src/app/not-found.tsx` - 404 page
   - `src/app/error.tsx` - Error boundary

5. **Auth Routes** (Partially Complete)

   - ✅ `src/app/auth/login/page.tsx`
   - ✅ `src/app/auth/sign-up/page.tsx`
   - ✅ `src/app/auth/forgot-password/page.tsx`
   - ✅ `src/app/auth/verify/page.tsx`
   - ⏳ `src/app/auth/magic-link/page.tsx` - TODO

6. **Layout Components Updated**
   - ✅ `CustomerLayout` - Updated to use App Router hooks

### 🚧 In Progress / TODO

#### High Priority Routes

- [ ] `/store/[id]` - Dynamic store routes
- [ ] `/category/[id]` - Category pages
- [ ] `/brands` - Brands listing
- [ ] `/search` - Search functionality
- [ ] `/vendor/*` - Vendor dashboard routes
- [ ] `/customer/*` - Customer dashboard routes

#### Medium Priority Routes

- [ ] `/ads-gallery` - Classified ads
- [ ] `/post-ad` - Post advertisement
- [ ] `/edit-ad` - Edit advertisement
- [ ] `/clips` - Clips feature
- [ ] `/messages` - Messaging system
- [ ] `/stores` - Stores listing
- [ ] `/mek/*` - MEK related routes
- [ ] `/mek-directory` - Directory

#### Lower Priority Routes

- [ ] `/contact-us` - Contact page
- [ ] `/privacy-policy` - Privacy policy
- [ ] `/terms-of-service` - Terms of service
- [ ] `/promote-store` - Store promotion
- [ ] `/find-vendor` - Vendor search
- [ ] `/get-list` - Listing pages
- [ ] `/new` - New items
- [ ] `/passwordless-login` - Passwordless authentication
- [ ] `/super-admin/*` - Admin dashboard

#### Special Routes

- [ ] `/server-sitemap.xml` - Convert to route handler
- [ ] API routes (if any) - Convert to route handlers

## Migration Patterns

### Pattern 1: Simple Page with Layout

**Pages Router** (`pages/example/page.tsx`):

```tsx
import Component from '@/components/Example'
import CustomerLayout from '@/components/Layout/Customerlayout'

const ExamplePage = () => {
  return <Component />
}

ExamplePage.getLayout = function getLayout(page: React.ReactElement) {
  return <CustomerLayout>{page}</CustomerLayout>
}

export default ExamplePage
```

**App Router** (`app/example/page.tsx`):

```tsx
import Component from '@/components/Example'
import CustomerLayout from '@/components/Layout/Customerlayout'
import type {Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Page description'
}

export default function ExamplePage() {
  return (
    <CustomerLayout>
      <Component />
    </CustomerLayout>
  )
}
```

### Pattern 2: Client Component with Hooks

**Pages Router**:

```tsx
import {useRouter} from 'next/router'
import {useState} from 'react'

const ExamplePage = () => {
  const router = useRouter()
  const [state, setState] = useState()
  // ... component logic
}
```

**App Router**:

```tsx
'use client'

import {useRouter, usePathname, useSearchParams} from 'next/navigation'
import {useState, useEffect} from 'react'

export default function ExamplePage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Set metadata via useEffect for client components
  useEffect(() => {
    document.title = 'Page Title'
  }, [])

  // ... component logic
}
```

### Pattern 3: Dynamic Routes

**Pages Router** (`pages/store/[id].tsx`):

```tsx
const StorePage = () => {
  const router = useRouter()
  const {id} = router.query
  // ...
}
```

**App Router** (`app/store/[id]/page.tsx`):

```tsx
export default function StorePage({params}: {params: {id: string}}) {
  const {id} = params
  // ...
}
```

### Pattern 4: Data Fetching (getStaticProps → Server Component)

**Pages Router**:

```tsx
export const getStaticProps: GetStaticProps = async context => {
  const data = await fetchData()
  return {props: {data}}
}

const Page = ({data}) => {
  return <div>{data}</div>
}
```

**App Router**:

```tsx
async function getData() {
  const data = await fetchData()
  return data
}

export default async function Page() {
  const data = await getData()
  return <div>{data}</div>
}
```

## Router API Changes

### Routing Hooks

| Pages Router                     | App Router                           | Notes                              |
| -------------------------------- | ------------------------------------ | ---------------------------------- |
| `useRouter()` from `next/router` | `useRouter()` from `next/navigation` | Different API                      |
| `router.query`                   | `useSearchParams()`                  | Get query parameters               |
| `router.pathname`                | `usePathname()`                      | Get current path                   |
| `router.push()`                  | `router.push()`                      | Same usage                         |
| `router.replace()`               | `router.replace()`                   | Same usage                         |
| `router.back()`                  | `router.back()`                      | Same usage                         |
| `router.asPath`                  | `pathname + searchParams`            | Combine pathname and search params |

### Link Component

Links remain largely the same, but some props have changed:

```tsx
// Both versions work similarly
<Link href="/path">Text</Link>
```

## Component Updates

### CustomerLayout

- ✅ Updated to use `next/navigation` hooks
- ✅ Marked as `'use client'`
- ✅ Changed `useRouter()` import source
- ✅ Added `usePathname()` and `useSearchParams()`

### Other Shared Components

Most components should work as-is, but verify:

- [ ] PageLayout
- [ ] BaseLayout
- [ ] SEOHead (may need updates for metadata)

## Configuration Updates

### next.config.js

Current configuration is mostly compatible with App Router. Key items:

- ✅ `transpilePackages` - Required for Ant Design
- ✅ `images` configuration - Works with both routers
- ✅ `redirects` - Works with both routers

### TypeScript

- Ensure `compilerOptions.jsx` is set to preserve or react-jsx
- Add App Router types if needed

## Testing Strategy

1. **Start Development Server**

   ```bash
   npm run dev
   ```

2. **Test Routes Systematically**

   - Test each migrated route manually
   - Verify navigation between routes
   - Check that layouts render correctly
   - Validate metadata appears in `<head>`

3. **Common Issues to Check**
   - Client components must have `'use client'` directive
   - Server components cannot use hooks
   - Layout components must accept `children` prop
   - Dynamic routes must use proper folder structure

## Migration Checklist

For each route:

1. [ ] Create new folder structure in `app/`
2. [ ] Copy component logic from `pages/`
3. [ ] Update imports (`next/router` → `next/navigation`)
4. [ ] Add `'use client'` if component uses hooks
5. [ ] Convert `getLayout` pattern to direct layout wrapping
6. [ ] Add metadata export or update via `useEffect`
7. [ ] Update any router API usage
8. [ ] Test the route in browser
9. [ ] Verify navigation to/from the route

## Notes

### Why Client Components?

Many components use:

- Redux hooks (`useAppSelector`, `useAppDispatch`)
- Router hooks (`useRouter`, `usePathname`)
- State hooks (`useState`, `useEffect`)
- Third-party hooks

These require `'use client'` directive.

### Coexistence

Pages Router and App Router can coexist during migration:

- App Router takes precedence for matching routes
- Unmigrated routes continue to work from `pages/`
- This allows incremental migration

### Performance Considerations

- Server Components (no 'use client') are rendered on server
- Client Components are hydrated on client
- Prefer Server Components when possible for better performance
- Use Client Components only when necessary (hooks, interactivity)

## Next Steps

1. **Continue Auth Routes**

   - Complete magic-link page migration

2. **Migrate Core Shopping Experience**

   - Store pages (dynamic routes)
   - Category pages (dynamic routes)
   - Search functionality
   - Product/service listings

3. **Migrate User Dashboards**

   - Vendor dashboard
   - Customer dashboard

4. **Migrate Remaining Routes**

   - Follow priority order listed above
   - Test thoroughly after each batch

5. **Cleanup**

   - Remove old `pages/` routes after verifying app routes work
   - Update any remaining components
   - Run full test suite

6. **Optimization**
   - Review Server vs Client Component usage
   - Implement proper loading states
   - Add Suspense boundaries where appropriate
   - Optimize metadata generation

## Resources

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
- [Routing Fundamentals](https://nextjs.org/docs/app/building-your-application/routing)
