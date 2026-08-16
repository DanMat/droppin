# droppin

Drop your Google Timeline export, get your travel map + stats — 100% in your browser. Powered by @danmat/waypoints-core.

[![CI](https://github.com/DanMat/droppin/actions/workflows/ci.yml/badge.svg)](https://github.com/DanMat/droppin/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Requirements

Node.js >= 24.0.0 (`.nvmrc` pins 24.18.0; run `nvm use`). Enforced via `engine-strict`, so installs fail fast on an unsupported version.

## Install

```sh
pnpm add droppin
```

## Develop

```sh
pnpm dev     # start the dev server
pnpm build   # production build
```

## Continuous integration

The `CI` workflow runs typecheck, lint, tests, and build on every push. It installs from a committed lockfile — so after creating the repo, run `pnpm install` and commit the generated `pnpm-lock.yaml`. Until then CI fails on the install step with a missing-lockfile error (expected on a brand-new repo).

## License

MIT © DanMat
