# CLAUDE.md — Torchlight

Guidance for working in this repository.

---

## WHAT WE ARE BUILDING

**Torchlight is a personalised astrology guidance app for Android.** A person enters their
birth date, time, and city once. The app reads that birth data through several astrological
traditions at once and returns guidance about personality, relationships, and daily life.

**The differentiator is cross-system synthesis.** The same birth data is interpreted through
Western, Vedic, Chinese, and Numerology, then _compared_ — showing where the traditions agree
about someone and where they diverge. Competitors (Co-Star, The Pattern, Chani) are all
single-tradition. This comparison layer is the product; everything else is table stakes.

**Three lanes:** Personal (own chart), Couples (compatibility), Spaces (home — v2).
**Retention hook:** a daily guidance reading.

**Audience:** primarily women 20–60 seeking personal development. Use inclusive language —
no age brackets or demographic labels anywhere in the UI copy.

**Brand:** a calm "digital sanctuary". Warm, credible, unhurried. Explicitly _not_ purple
cosmic entertainment astrology.

---

## CURRENT STATE

Rebuild in progress on the `prod` branch. The old Replit-era web app remains on `main` for
reference only — do not import from it.

**Done (phase 2 foundation):**

- Turborepo monorepo: `apps/backend`, `apps/mobile`, `packages/shared-types`
- NestJS backend that builds, boots, and serves `/api/health`
- Drizzle schema + first migration (users, birth_profiles, charts, refresh_tokens)
- Response envelope, exception filter, Zod validation pipe
- CI: build, typecheck, lint, test

**Not built yet:** everything else — auth, the calculation engine, every screen, the mobile
app itself.

---

## ARCHITECTURE

```
apps/backend                 NestJS 11 API, deployed to Vercel as a single function
apps/mobile                  React Native 0.82 (bare), Android-first
packages/shared-types        Zod schemas — the API contract, shared by both
reference/legacy-algorithms  Old astrology code, kept to port from. NOT imported.
reference/product-vision     Original spec, design system, and contribution psychology.
```

**`apps/backend` is deliberately NOT an npm workspace.** It has its own `package-lock.json`
and installs standalone. Workspace hoisting scatters binaries unpredictably (`tsc` to the
repo root, `nest` staying local) and neither lands reliably on `PATH` during a Vercel build.

**`packages/shared-types` is the contract.** Every request and response shape is a Zod schema
defined once here and imported by both sides. Its `react-native` export condition points at
raw TypeScript (Metro compiles it) while `default` points at compiled JS for Node.

### Global response contract

- Success: `{ ok: true, data: {...} }` — via `ResponseInterceptor`
- Error: `{ ok: false, error: "message", statusCode: 400 }` — via `GlobalExceptionFilter`

Handlers return plain domain objects and never build an envelope by hand. That is what keeps
the contract from drifting one endpoint at a time.

---

## TECHNOLOGY STACK

Verify against `package.json` before trusting any version here.

- **Backend:** NestJS 11.0.6, TypeScript 5.9.3, Node 20+
- **Database:** Neon Postgres + Drizzle ORM
- **Mobile:** React Native 0.82, React 19, React Navigation 7
- **Validation:** Zod 3.23.8 everywhere — no class-validator
- **Hardening:** helmet, `@nestjs/throttler`
- **AI:** Anthropic via Vercel AI SDK, tiered — Sonnet 5 for text a user reads,
  Haiku 4.5 for internal decisions nobody reads
- **Payments:** Razorpay. **Stubbed for now** — see Payments below.

---

## DEPLOYMENT

Backend deploys to **Vercel** from the `prod` branch. Project root directory is
`apps/backend`. The mobile app is excluded from the upload.

The user tests on a physical Android phone against the deployed API — **there is no local
backend in the normal loop.** Changes must reach Vercel to be testable.

### Build configuration — read before changing it

1. **`npm ci --include=dev`** — Vercel sets `NODE_ENV=production`, so npm skips
   devDependencies by default. Without the flag, TypeScript and the Nest CLI are never
   installed and the build fails with a confusing "command not found" (exit 127).
2. **`api/index.ts` imports from `../dist`, not from source.** Decorator metadata must match
   what Nest emitted or dependency injection fails at runtime. This is also why CI builds
   _before_ typechecking: `dist/` is gitignored, so on a fresh checkout the api typecheck
   cannot resolve that import until the build has run.
3. **`vercel.json` takes no comments.** Vercel's schema rejects unknown keys, including
   `"// note"` style ones. Reasoning lives here instead.
4. **The bootstrap _promise_ is cached at module scope**, not the resolved app. Caching the
   resolved value lets two concurrent cold requests each open their own database pool.

### Function configuration

| Setting       | Value | Why                                                                                              |
| ------------- | ----- | ------------------------------------------------------------------------------------------------ |
| `maxDuration` | 60    | Longest operation is an LLM reading, ~10–30s. Pro allows up to 800 if a future feature needs it. |
| `memory`      | 1024  | Ephemeris maths is CPU-bound; measure before lowering.                                           |

### Scheduling

Daily guidance generation runs via **GitHub Actions cron → `POST /api/cron/tick`**,
authenticated with `CRON_SECRET`. Not yet implemented. Vercel Hobby cron only fires once
daily with up to 59 minutes of jitter, so an external cron is the pattern regardless of plan.
Make the tick idempotent — a late or duplicated run must not double-send.

---

## DEVELOPMENT COMMANDS

```bash
# Backend (from apps/backend — it is not in the workspace)
npm run dev            # watch mode, localhost:3000
npm run build          # nest build → dist/
npm run typecheck      # src
npx tsc -p tsconfig.api.json   # api entry, requires dist/ to exist
npm run lint:ci
npm test

# Database
npm run db:generate    # generate a migration from schema.ts
npm run db:migrate     # apply pending migrations

# Root
npm run format
```

---

## CODING STANDARDS

### TypeScript

- `strict`, plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- No `any` — lint rejects it
- Import types with `import type`

### Validation

- Every request body validated by a Zod schema from `@torchlight/shared-types`
- Never define a validation rule in the backend that the app cannot see

### Comments

Explain _why_, not _what_. Record decisions that were expensive to discover — a wrong
approach that was tried, a constraint that is not obvious from the code. The build-before-
typecheck ordering above is the model: someone will otherwise "fix" it back.

---

## ASTROLOGY CORRECTNESS

This is the part that has to be right. The app makes accuracy claims, so a wrong reading is a
broken product, not a cosmetic bug.

- **Nothing ships without a verified algorithm.** The previous build derived Human Design
  type from `(hours + minutes) % 5` — invented arithmetic presented as a real system. Every
  system needs a named traditional source and a test against reference output.
- **Test against astro.com** or Swiss Ephemeris for at least 20 known charts before trusting
  the engine.
- **Timezones are the most common source of wrong charts.** A 1962 birth needs the historical
  offset _and_ that era's DST rules. Use the IANA database; never compute an offset by hand.
- **Birth time is optional.** Many people do not know theirs. `birthTime: null` suppresses
  houses and ascendant and says so — never invite a guess, which silently produces a
  confidently wrong chart.
- **Never present a placeholder as a calculation.** The old results screen computed sun signs
  from date ranges in the browser and derived "destiny number" from the length of a name.

`reference/legacy-algorithms/` holds the old code worth porting _from_ — the VSOP87 ephemeris
maths and the Vedic nakshatra/dasha logic are genuine. Port and verify; do not import.

---

## PAYMENTS

**Razorpay, not Stripe. Currently stubbed — build the flow, wire it to a no-op.**

**Never mention EagleCortex anywhere in the app** — not in UI, store listing, about screens,
API responses, or error text. Torchlight stands alone.

**Unresolved:** Google Play requires **Google Play Billing** for anything unlocking digital
content or features; using Razorpay for that means rejection. Razorpay is permissible for
genuine donations that unlock nothing. The "Sacred Energy Exchange" is framed as a pure
contribution, which is the framing that could permit it — but only while it genuinely unlocks
nothing. Keep the payment layer behind an interface so the gateway stays swappable.

---

## THE ENERGY EXCHANGE

Contributions use spiritually-meaningful amounts (₹ equivalents of 5/11/22/33) and are asked
for only after real value has been delivered. The restraint is the entire point:

- "Continue Free" and "Share Energy" get **equal visual weight**
- **One ask per session** — never re-prompt after a dismissal
- Always offer "can't contribute? share instead" as an equal path
- Warm and dismissible; never urgent, never guilt-inducing

---

## KNOWN GAPS

- Auth not implemented (schema exists, no endpoints)
- Calculation engine not started
- Mobile app not scaffolded
- `apps/backend/drizzle/` migration generated but never applied to a real database
- Neon database not created and Vercel project not linked
