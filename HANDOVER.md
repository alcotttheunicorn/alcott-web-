# Alcott Web — Handover Status

> Status of every screen as of 2026-07-16. Grouped by backend integration status.
>
> The backend is a **separate Node/Express/Prisma repo**. Its API is documented in `end.points`
> (a pasted Copilot chat containing the Postman collection — auth, profile, and shipment endpoints only).
> The frontend talks to it via `lib/api-client.ts` (axios, `NEXT_PUBLIC_API_BASE_URL`).

---

## ✅ Integrated screens (wired to the backend)

These pages make real API calls and work end-to-end (given `NEXT_PUBLIC_API_BASE_URL` is set).

| Screen | Route | Endpoint(s) | Notes / caveats |
|---|---|---|---|
| Register | `/auth/register` | `POST /auth/signup/` | Email + password only; no password rules, no confirm-password |
| Verify Email | `/auth/verify-email` | `POST /auth/verify-email`, `POST /auth/resend-verification` | 6-digit OTP; email prefilled from `pendingSignupEmail` (localStorage) |
| Sign In | `/auth/sign-in` | `POST /auth/signin` | Token + user JSON → localStorage ("remember me") or sessionStorage; unverified users bounced to verify |
| Profile Setup | `/profile-setup` | `POST /profile` (multipart, Bearer) | **Orphaned route** — nothing in the app navigates to it. Prefill bug: `last_name` never loads (`page.tsx:53`) |
| New Shipment wizard | `/shipment/new` | `POST /shipments` (Bearer) | The one real product feature. 5 steps with validation and unit conversion. BUT: shipping rates + payment methods are hardcoded client-side (should fetch `GET /shipments/rates/list`); no payment is actually taken |

---

## 🟡 Built but NOT integrated (UI complete, mock/hardcoded data)

These screens are visually finished but run entirely on hardcoded data. Form submits either
do nothing, `console.log`, or simulate success.

### Customer app

| Screen | Route | What's mock / dead |
|---|---|---|
| Landing page | `/` | Track / request-delivery / check-rates buttons are `alert('coming soon')`; nav links `href="#"`; leftover "haul247" copy (`app/page.tsx:660`) |
| Auth chooser | `/auth/lets-get-you-in` | Google/Apple buttons decorative |
| Forgot Password (3 pages) | `/auth/forgot-password`, `/verify`, `/new-password` | **Looks functional but calls no API — password never actually resets.** Backend endpoints (`/auth/forgot-password`, `/auth/reset-password`) exist and are unused. 4-digit OTP inconsistent with the 6-digit email OTP |
| Profile Setup Success | `/profile-setup/success` | Static card → redirects to `/home` after 3 s |
| Home / Dashboard | `/home` | Balance `941,800.00NGN`, user "Olusegun Matanmi", transaction preview — all string literals. "Nearby Drop" links to nonexistent `/locations` |
| Shipment Success | `/shipment/new/success` | Shows **hardcoded tracking number** `156436770922`; the real API response is saved to `sessionStorage.lastCreatedShipment` but never read. "View E-Receipt" → nonexistent `/receipt/[id]` |
| Orders | `/orders` | 4 hardcoded orders; backend `GET /shipments` exists, unused. "Pending" tab always empty (no mock order has that status); "Track" button has no handler |
| Check Rates | `/rates` | Pricing computed in the frontend (₦12k/18k/24k base + ₦1k/kg, USD hardcoded @ 1500 NGN). Diverges from wizard pricing, which ignores weight |
| Wallet Top-up | `/topup` | Fully simulated 2-step flow; no wallet API exists anywhere. Figma artifact "Auto Layout Vertical" rendered on step 2 |
| Transactions | `/transactions` | Infinite scroll over procedurally generated fake data; re-render bug (unstable `useCallback` deps, `page.tsx:84`) |
| Inbox | `/inbox` | Hardcoded chats/calls; rows not clickable |
| Search | `/search` | Mock: only matches queries containing "sk". Backend tracking endpoint exists, unused. "Clear All" dead |
| Settings | `/settings` | All rows static. **Logout does nothing** (token not cleared, no redirect). Dark-mode toggle only flips local state |
| Help Center | `/help` | FAQ search/tabs work client-side, but content includes Lorem ipsum and a literal "Question" placeholder entry. All contact buttons + message box dead |

### Admin section (`/admin/*`) — 100% prototype

Zero API calls in the entire section, zero auth/role checks (any visitor can open it),
every submit is `console.log`, ~30 buttons have no handler. No admin backend endpoints exist yet.

| Screen | Route | What's mock / dead |
|---|---|---|
| Admin Orders | `/admin/orders` | 5 mock orders; status-tab filter works client-side |
| Admin Order Detail | `/admin/orders/[id]` | Rich UI keyed off a mock object (ids `1`–`5`); all 7 action buttons (Edit / Close / Cancel / New Event / Finance…) dead |
| Admin Rate Check | `/admin/rates` | Calendar widget navigates/selects but never filters the (mock) list; 6-row months drop days (42-cell grid sliced to 35) |
| Admin Users | `/admin/users` | Most stub-heavy page: static SVG charts, dead pagination/search/CSV download |
| Order Events | `/admin/settings/events` | Add-modal opens; submit is `console.log`; per-item edit/delete dead |
| Policies | `/admin/settings/policies` | Lorem ipsum bodies; EDIT dead |
| Pricing — Premise | `/admin/settings/pricing/premise` | 4 NGN inputs defaulting to `1000`; `console.log` submit |
| Pricing — Regions | `/admin/settings/pricing/regions` | Region/zone/price mocks; modal tag add/remove works; `console.log` submit; duplicate `'Kebbi'` in default state breaks tag removal |
| Pricing — Zones | `/admin/settings/pricing/zones` | Most-developed modal (dynamic price rows add/remove/edit in state); `console.log` submit |

---

## 🔴 Not built / broken routes

Routes that are linked from the UI but don't exist (they 404):

| Route | Linked from |
|---|---|
| `/locations` | Home "Nearby Drop" quick action (`app/home/page.tsx:77`) |
| `/receipt/[id]` | Shipment success "View E-Receipt" (`app/shipment/new/success/page.tsx:30`) |
| `/admin` | No index page — direct visits 404 |
| `/admin/monitor` | Admin sidebar "Monitor" link (`app/admin/layout.tsx:234, 331`) |

Also unreachable: the admin **mobile** nav omits the Pricing pages and Events entirely.

---

## Backend endpoint scorecard

| Endpoint | Status |
|---|---|
| `POST /auth/signup`, `/auth/verify-email`, `/auth/resend-verification`, `/auth/signin` | ✅ wired |
| `POST /profile` | ✅ wired (but page is orphaned) |
| `POST /shipments` | ✅ wired |
| `POST /auth/forgot-password`, `POST /auth/reset-password` | ⬜ exists on backend, **not wired** (fake UI instead) |
| `GET /shipments`, `GET /shipments/:id`, `GET /shipments/tracking/:trackingId` | ⬜ exists, not wired (orders/search use mocks) |
| `GET /shipments/rates/list`, `GET /shipments/categories/list` | ⬜ exists, not wired (wizard hardcodes both) |
| `GET /profile/:username`, `PATCH /profile/:username` | ⬜ exists, not wired (settings is static) |
| Wallet / top-up / transactions | 🔴 no backend endpoints exist |
| Inbox / chat | 🔴 no backend endpoints exist |
| Admin (orders, users, events, policies, pricing) | 🔴 no backend endpoints exist |

---

## Critical things to know before touching the code

1. **`NEXT_PUBLIC_API_BASE_URL` must be set at build/deploy time.** There is no `.env*` file in
   the repo and no fallback — without it every API call hits the Next.js origin and 404s.
2. **`<Toaster />` is never mounted** (`app/layout.tsx`), so every `toast()` call in the app —
   including all sign-in/register/shipment error feedback — is silently invisible. One-line fix.
3. **Build checks are disabled** in `next.config.mjs` (`ignoreBuildErrors`, `ignoreDuringBuilds`),
   and `tsc --noEmit` currently fails with 2 real errors:
   `app/auth/forgot-password/verify/page.tsx:103` (ref callback) and
   `app/profile-setup/page.tsx:53` (`last_name` vs `lastName`). Fix these, then re-enable checks.
4. **There is no route protection anywhere.** No `middleware.ts`; `/home` and all of `/admin/*`
   are reachable logged out. JWT + full user JSON live in localStorage/sessionStorage
   (keys: `authToken`, `authUser`, `pendingSignupEmail`).
5. **There is no shared dashboard layout.** The sidebar/header/bottom-nav is copy-pasted into
   ~10 page files in two divergent styles (≈250 duplicated lines each, with drift: active-nav
   highlighting only works on 4 pages, `fixed` vs `sticky` bottom nav, different background hexes).
   Extract an `app/(dashboard)/layout.tsx` route group before building more pages.
6. **State management is per-page `useState` only** — no context/store, no data-fetching library,
   no form library (react-hook-form/zod are installed but unused). Auth token is re-read from
   storage manually on each page that needs it.
7. Misc hygiene: dual lockfiles (npm + pnpm); Urbanist font loaded twice; brand color `#4043FF`
   hardcoded everywhere instead of a theme token; dead code (`theme-provider.tsx`,
   `components/ui/use-mobile.tsx` duplicate, `LoadingSpinner`, both toast systems);
   ~2 MB of unreferenced images in `public/`.

## Suggested order of attack

1. Mount `<Toaster />` → un-breaks all user feedback (1 line).
2. Fix the 2 `tsc` errors → re-enable TS/ESLint in `next.config.mjs`.
3. Add `middleware.ts` auth guards; wire Logout (clear storage + redirect).
4. Extract the shared dashboard layout (route group).
5. Wire the wizard to `GET /shipments/rates/list` + `/categories/list`; make the success page
   read the real tracking number from `sessionStorage.lastCreatedShipment`.
6. Wire `/orders` to `GET /shipments` and `/search` to the tracking endpoint.
7. Implement forgot-password against the existing backend endpoints.
8. Decide the admin section's fate — it needs backend endpoints that don't exist yet.
