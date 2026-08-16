# droppin 📍

**Drop your Google Timeline export → get your travel map + stats. 100% in your browser.**

Your `location-history.json` never leaves your device: it's parsed and aggregated
in a **Web Worker** on your machine. Home & work are dropped automatically (from
Google's own labels), airport layovers don't count, and only **city-level** data
is ever shown — never your exact coordinates.

Live example (my own travels): **[waypoints.danmat.workers.dev](https://waypoints.danmat.workers.dev)**

## How it works

```
drop location-history.json
   → Web Worker: @danmat/waypoints-core aggregates it (offline gazetteer)
   → render with @danmat/waypoints-ui (world map, stat tiles, table)
```

All the logic lives in the reusable packages
[`@danmat/waypoints-core`](https://www.npmjs.com/package/@danmat/waypoints-core)
and [`@danmat/waypoints-ui`](https://www.npmjs.com/package/@danmat/waypoints-ui);
this app is just the drop-zone + worker + hosting.

## Develop

```sh
pnpm install
pnpm prep:data   # download the offline gazetteer (GeoNames + OurAirports) → public/data
pnpm dev
```

## Deploy

```sh
pnpm deploy      # build (re-preps data) + wrangler pages deploy
```

## License

MIT © DanMat
