# Strapi CMS

Headless CMS backend for the Next.js frontend. Provides structured content with i18n support.

## Features

- **Strapi 4.25** with SQLite (dev) / Postgres-ready (prod)
- **i18n** with English & Marathi locales
- **Auto-populate Middleware** - No need for `populate=*` in API calls
- **Content Types**: Pages, Posts, About, Global settings
- **Dynamic Zones** with reusable blocks

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start Strapi in dev mode
npm run develop
```

Access admin at http://localhost:1337/admin

### With Docker

From parent directory:

```bash
docker compose -f docker-compose.local.yml up -d cms
```

## Content Types

| Type | API | Description |
|------|-----|-------------|
| **Page** | `/api/pages` | Dynamic pages with blocks |
| **Post** | `/api/posts` | Blog posts with cover, blocks |
| **About** | `/api/about` | Single type for about page |
| **Global** | `/api/global` | Site settings, navigation |
| **Route** | `/api/routes` | Navigation link definitions |

## Auto-Populate Middleware

Each content type has middleware that auto-populates relations:

```
src/api/{type}/middlewares/{type}-populate.js
src/api/{type}/routes/{type}.js  → registers middleware
```

**Example** (`global-populate.js`):
```js
const populate = {
  navigation: true,
  navigationItems: { populate: { route: true } },
  defaultSeo: true,
};
```

Frontend can call `/api/global?locale=en` without specifying populate.

## Seeding Data

```bash
# Interactive seed
./seed.sh

# Or manually
SEED_DATA=true npm run develop
```

See `SEED_INSTRUCTIONS.md` for details.

## Project Structure

```
src/
├── api/
│   ├── about/             # About single type
│   ├── global/            # Global settings
│   ├── page/              # Dynamic pages
│   ├── post/              # Blog posts
│   └── route/             # Navigation routes
├── components/
│   ├── blocks/            # Dynamic zone components
│   ├── elements/          # Reusable elements
│   └── shared/            # SEO, navigation
├── middlewares/           # Global middlewares
└── seed/                  # Seed data
config/
├── database.js            # SQLite config
├── server.js              # Host/port config
└── middlewares.js         # Middleware order
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `HOST` | Server host | `0.0.0.0` |
| `PORT` | Server port | `1337` |
| `APP_KEYS` | Strapi app keys | `key1,key2` |
| `DATABASE_FILENAME` | SQLite path | `.tmp/data.db` |

## Webhook Setup (for Next.js cache invalidation)

1. Go to Settings → Webhooks
2. Create webhook:
   - **Name**: Next.js Revalidate
   - **URL**: `http://frontend:3000/api/revalidate` (Docker) or your prod URL
   - **Headers**: `x-webhook-secret: <your-secret>`
   - **Events**: entry.create, entry.update, entry.delete, entry.publish, entry.unpublish

## Scripts

| Command | Description |
|---------|-------------|
| `npm run develop` | Start dev server with auto-reload |
| `npm run start` | Start production server |
| `npm run build` | Build admin panel |
