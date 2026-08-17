# NYC 1199 Hospital Atlas

Interactive map of 39 major 1199SEIU-affiliated NYC hospitals that staff pharmacy
technicians. Filter by borough, network, and subway access; enter a home address to
get transit and driving commute times to every hospital at once; pin hospitals to
compare them side by side.

**Stack:** TanStack Start v1 · React 19 · Vite 7 · Tailwind v4 · shadcn/ui ·
Google Maps JS API · Google Routes API

---

## Quick start

```bash
npm install
cp .env.example .env      # fill in your keys
npm run dev
```

Dev server runs on Vite's default port. `routeTree.gen.ts` is generated
automatically by the TanStack router plugin on first run — it is gitignored on
purpose, don't commit it.

```bash
npm run build     # production build
npx wrangler dev  # preview the build (see note below)
npm run lint      # eslint
npm run format    # prettier
```

---

## Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY` | client | Loads the Maps JavaScript API in `HospitalMap.tsx` |
| `LOVABLE_API_KEY` | server | Bearer token for the Lovable connector gateway |
| `GOOGLE_MAPS_API_KEY` | server | Passed through the gateway as `X-Connection-Api-Key` |

The client key is bundled into the browser build — restrict it by HTTP referrer in
the Google Cloud console. The two server keys are read via `process.env` inside
server functions and never reach the client.

**APIs to enable in Google Cloud:** Maps JavaScript API, Geocoding API, Routes API.

### Going off the Lovable gateway

`src/lib/api/commute.functions.ts` proxies both Google calls through
`https://connector-gateway.lovable.dev/google_maps`. If you deploy outside Lovable
and want to call Google directly with your own key, change two things:

1. **Route matrix** — point the fetch at
   `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix` and replace
   the `Authorization` / `X-Connection-Api-Key` headers with
   `X-Goog-Api-Key: <your key>`. Keep the `X-Goog-FieldMask` header as-is.
2. **Geocoding** — point the fetch at
   `https://maps.googleapis.com/maps/api/geocode/json`, drop both auth headers, and
   append `&key=<your key>` to the query string.

`LOVABLE_API_KEY` becomes unnecessary after that swap.

---

## Structure

```
src/
  data/hospitals.ts          39 hospital records + network & MTA line color maps
  routes/index.tsx           the whole atlas UI (filters, list, compare, sheet)
  routes/__root.tsx          document shell, fonts, providers
  components/HospitalMap.tsx Google Maps wrapper, markers, home pin
  components/LineBullet.tsx  MTA subway line bullets
  lib/api/commute.functions.ts  server fns: geocodeAddress, getCommutes
  lib/error-page.ts          dependency-free 500 page (SSR hard-failure shell)
  lib/error-capture.ts       captures errors h3 would otherwise swallow
  components/ui/*            shadcn/ui primitives
  server.ts / start.ts       SSR entry + error middleware
```

The UI is fully data-driven: add or edit entries in `src/data/hospitals.ts` and
filters, map markers, and the compare table pick them up with no other changes.
If you add a network, add a matching hex to `NETWORK_COLORS` in the same file.

**Data caveat:** coordinates, nearest-station, and walk-minute values were
hand-compiled and are approximate. Verify anything commute-critical before acting
on it, and confirm current 1199SEIU representation directly — bargaining units
change.

---

## Deployment

`vite.config.ts` uses `@lovable.dev/vite-tanstack-config`, which bundles Nitro with
**Cloudflare as the default build target**. That matters if you're deploying
elsewhere:

- **Cloudflare Workers/Pages** — works as-is. Set all three env vars as secrets.
- **Vercel / Netlify** — you'll need to override the Nitro preset (`NITRO_PRESET=vercel`
  or `netlify`) or drop the Lovable config wrapper in favor of a plain
  `tanstackStart()` + `viteReact()` + `tailwindcss()` + `tsConfigPaths()` config.
  Note the wrapper also supplies the `@` path alias and React/TanStack dedupe, so
  replicate those if you replace it. Both platforms need the env vars set in the
  project dashboard, and `VITE_`-prefixed ones must be present at **build** time,
  not just runtime.
- Server functions require a Node/edge runtime — a static export will break the
  address and commute features.

---

## Notes on this checkout

Reconstructed from a flat source dump. Two modules referenced by `server.ts` and
`start.ts` (`lib/error-page.ts`, `lib/error-capture.ts`) were absent from the dump
and have been reimplemented to match their call signatures — behavior is
equivalent, but they are not byte-identical to the originals. Everything else is
verbatim.


---

## Previewing a production build

The Vite config (`@lovable.dev/vite-tanstack-config`) bundles Nitro with the
**`cloudflare-module`** preset. Two consequences worth knowing before you debug
a "broken" build:

- `.output/server/index.mjs` is a Cloudflare Workers module export, **not** a
  Node HTTP listener. `node .output/server/index.mjs` will not start a server.
- `vite preview` looks for `dist/server/server.js`, which the Cloudflare target
  never writes, so it 500s. Use `npx wrangler dev` instead.

For local development just use `npm run dev`.

## Deploying

Cloudflare Workers/Pages works as-is (`npx wrangler deploy`).

For Vercel or Netlify, set `NITRO_PRESET=vercel` / `netlify` at build time, or
replace the Lovable config wrapper. If you replace it, note it also provides the
`@` path alias and React/TanStack dedupe — replicate both.

`VITE_`-prefixed variables are inlined at **build** time, not read at runtime, so
they must be present in the build environment. Note also that a fully static
export will break address lookup and commute times: both are server functions
(`geocodeAddress`, `getCommutes`).

## `standalone/`

`standalone/NycAtlasStandalone.jsx` is a single-file React version that runs with
no server, no API keys, and no network access — useful as a preview or offline
fallback.

It embeds real geodata: borough outlines, MTA track alignments (23 routes in the
official trunk colors), 291 neighborhood boundaries, 470 subway stations, and 96
parks/landmarks. Pan/zoom with level-of-detail that reveals neighborhoods,
stations, then station names as you zoom in.

**It is not a substitute for the main app.** Commute times there are estimated
from straight-line distance rather than routed transit, so they are only good for
relative ordering. Station data is 2010-vintage (no Second Ave / Hudson Yards)
and route geometry is from a 2015 export, so service patterns may have changed.

## Data accuracy

Hospital coordinates, nearest stations, and walk minutes were hand-compiled and
are approximate. 1199SEIU bargaining units change over time. Confirm current
union representation and pharmacy-tech hiring directly with each employer.
