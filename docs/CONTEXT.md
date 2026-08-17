# NYC 1199 Pharmacy Tech Atlas — Project Context

Handoff notes so any new chat in this project starts informed.

## What this is

A map of the 39 NYC hospitals in the 1199SEIU network, built to help
evaluate pharmacy-tech roles by location and subway commute.

Two versions exist:

1. **`nyc-1199-atlas-source.md`** — the deployable TanStack Start app
   (Lovable export, 61 files). This is the source of truth.
2. **`nyc-1199-atlas-standalone.jsx`** — a single-file React version that
   runs with no server, no API keys, and no network. Preview/fallback only.

## State of the deployable app

- Production build passes; `tsc --noEmit` clean; dev server returns 200 with
  full SSR content.
- Dataset verified: 39 hospitals, no duplicate IDs, all coords inside NYC
  bounds, all 13 networks mapped to colors.
- **Two files are missing from the export**: `src/lib/error-page.ts` and
  `src/lib/error-capture.ts` are imported by `server.ts`/`start.ts` but absent
  from the dump. Working reimplementations exist; if re-exporting from
  Lovable, prefer Lovable's originals.

### Deployment gotcha

`@lovable.dev/vite-tanstack-config` bundles Nitro with the
**`cloudflare-module`** preset. Confirmed empirically:

- `.output/server/index.mjs` is a Workers module export, NOT a Node HTTP
  listener — `node .output/server/index.mjs` will not boot it.
- `vite preview` fails: it looks for `dist/server/server.js`, which the
  Cloudflare target never writes. Preview via `wrangler dev`.
- Cloudflare Workers/Pages deploys as-is. For Vercel/Netlify set
  `NITRO_PRESET=vercel` or `netlify`, or replace the Lovable wrapper — but
  that wrapper also supplies the `@` path alias and React/TanStack dedupe,
  so replicate both.
- `VITE_`-prefixed keys must be set at **build** time, not just runtime.
- A static export breaks address lookup and commute features — both are
  server functions (`geocodeAddress`, `getCommutes`).

## State of the standalone version

Runs anywhere as a React component. Contains real data, not placeholders.

**Map layers** (all from open geodata, none hand-drawn):
- Borough outlines — NYC open boundary data. Verified: all 39 hospitals fall
  inside the outline of the borough they're labeled with.
- Subway routes — real MTA track alignments, 23 routes, 11 official trunk
  colors, sourced from `chriswhong/streeteasy-subways`.
- 291 neighborhood boundaries + names — Pediacities NYC.
- 470 subway stations w/ coordinates and served lines — NYC DOITT.
- 96 parks and landmarks.

**Interaction**: drag to pan, scroll/pinch zoom, double-click zoom, zoom
buttons, fit-to-results, reset. Transform math is unit-tested (point under
cursor stays fixed; zoom in/out returns to origin with no drift). All strokes
and marker radii counter-scale so they hold constant screen size.

**Level of detail** reveals on zoom: 1x boroughs+lines+hospitals · 1.6x
neighborhood boundaries · 1.8x neighborhood names · 2.4x station dots ·
3x landmarks · 4.5x station names.

### Known limits of the standalone version

- **Commute times are estimates from straight-line distance**, NOT routed
  transit. Useful for relative ordering only. The deployable app calls the
  Google Routes API for real times.
- No streets — street centerlines for all five boroughs are far too large to
  embed. Neighborhood boundaries + stations carry the spatial reference.
- Station data is 2010 DOITT, so Second Ave / Hudson Yards are missing.
- Subway repo last updated 2015: track alignments are accurate (track rarely
  moves), service patterns have since changed.
- Zoom capped at 12x — past that you magnify simplification artifacts.

## Data caveat that matters

Hospital coordinates, nearest stations, and walk minutes were hand-compiled
and are approximate. 1199SEIU bargaining units change over time. Confirm
current union representation and pharmacy-tech hiring directly with each
employer before relying on any of this for a job decision.

## Open items

- Resolve the Lovable build failure.
- Add the Google Routes API key.
- Decide the deploy target (Cloudflare is the path of least resistance).
