# Nuxt Minimal Starter

Simple Nuxt project for the course "Web Page Construction II" at IFRS - Porto Alegre.

**Author:** Allan Ornel

This repository is a minimal Nuxt 4. It contains a small task manager app demonstrating Nuxt pages, server API routes, and basic state handling.

**Highlights:**
- Minimal Nuxt 4 project structure
- Example server API routes under `server/api`
- Simple JSON-backed local DB in `server/db`
- Reusable UI components in `app/components/ui`

## Prerequisites

- Node.js (LTS recommended)
- A package manager: `npm`, `pnpm`, `yarn` or `bun`

## Setup

Install dependencies with your preferred package manager:

```powershell
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun (if used)
bun install
```

## Development Server

Start the development server (opens on `http://localhost:3000` by default):

```powershell
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```powershell
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Preview the production build locally:

```powershell
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Project Structure (short)

- `app/` — Nuxt app, pages, and components
- `server/api/` — server API routes used by the app
- `server/db/` — simple JSON files used as a local data store for demos
- `types/` — shared TypeScript types

## Contributing

This project is a educational artifact. If you'd like to suggest improvements or fixes, please open an issue or submit a pull request.

## Resources

- Nuxt documentation: https://nuxt.com/docs

---
_Created for the "Web Page Construction II" course at IFRS - Porto Alegre._