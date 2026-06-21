# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript app for the Oodi smart building MVP. Entry points are `src/main.tsx` and `src/App.tsx`, with styles in `src/index.css` and `src/App.css`. Domain code is grouped under `src/data/`: `nuuka/`, `weather/`, `time/`, and `utilities/`. Shared configuration lives in `src/config/`. Static assets and generated public data belong in `public/`, including `public/data/nuuka/snapshots/`. Specs, ADRs, and reference images are in `docs/`; raw discovery outputs are in `data/`. Scripts are in `scripts/`.

## Build, Test, and Development Commands

Run from the repository root:

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server.
- `npm run build` typechecks and creates the production build.
- `npm run preview` serves the built app locally.
- `npm test` runs Vitest in watch mode.
- `npm run typecheck` runs `tsc -b` without building assets.
- `npm run lint` runs ESLint across the project.
- `npm run discover:nuuka` and `npm run snapshots:nuuka` refresh Nuuka data.

## Coding Style & Naming Conventions

Use TypeScript modules and React function components. Keep data access and normalization in `src/data/<domain>/`, not UI components. Name files by responsibility, for example `weatherClient.ts`, `normalizeNuukaSeries.ts`, or `utilityRepository.ts`. Name tests as colocated `*.test.ts` files. Follow the existing two-space indentation style and omit semicolons. ESLint uses `@eslint/js`, `typescript-eslint`, React Hooks, and React Refresh rules.

## Testing Guidelines

Vitest is configured for Node and includes `src/**/*.test.ts`. Add focused unit tests beside changed modules, especially for parsing, cache behavior, validation, fallback data, and time semantics. Use the relevant `fixtures/` directory for sample API payloads. Before submitting, run `npm test`, `npm run typecheck`, and `npm run lint`.

## Commit & Pull Request Guidelines

Recent history uses concise Conventional Commit-style subjects, such as `feat(weather): implement Stage 3 Open-Meteo integration` and `fix(data): complete Stage 2 fallback and verification`. Prefer `feat(scope): ...`, `fix(scope): ...`, or `docs(scope): ...`. Pull requests should explain the change, list validation commands, link related issues or specs, and include screenshots for UI changes. Note generated data updates when `public/data/` or `data/` changes.

## Security & Configuration Tips

Do not commit API keys, credentials, or local environment files. Treat external API payloads as untrusted: validate and normalize them before exposing them to UI or repositories. Keep generated snapshots deterministic so reviews can distinguish real data changes from formatting churn.
