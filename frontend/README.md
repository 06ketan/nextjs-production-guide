# Next.js Frontend with Redis Cache Handler

Production-grade Next.js 15 frontend with custom Redis cache handler for ISR/SSR caching.

## Features

- **Next.js 15** with App Router
- **Custom Redis Cache Handler** for distributed caching (ISR, route handlers, images)
- **Redis Cluster Support** for HA deployments
- **i18n** with English & Marathi locales
- **Strapi CMS Integration** with auto-populated content
- **TypeScript** throughout
- **Tailwind CSS v4** styling

## Quick Start

### Local Development (no Docker)

```bash
# Install dependencies
npm install

# Start dev server (uses localhost:1337 for Strapi)
npm run dev
```

### With Docker (Redis Cluster + CMS + Frontend)

From parent directory:

```bash
docker compose -f docker-compose.local.yml up -d
```

Access:
- **Frontend**: http://localhost:3000
- **CMS Admin**: http://localhost:1337/admin
- **RedisInsight**: http://localhost:8001

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `STRAPI_URL` | CMS API URL | `http://localhost:1337` |
| `STRAPI_TOKEN` | CMS API token (optional) | - |
| `REDIS_URL` | Standalone Redis URL | - |
| `REDIS_CLUSTER_URLS` | Comma-separated cluster URLs | - |
| `REDIS_AUTH` | Redis password | - |
| `REDIS_CACHE_DEBUG` | Log cache operations | `false` |

## Redis Cache Handler

The custom cache handler (`src/lib/cache/cache-handler.ts`) replaces Next.js default in-memory cache with Redis.

**Build the cache handler:**

```bash
npm run build:cache  # Compiles to .cache-handler/
npm run build        # Includes build:cache automatically
```

**Priority order for Redis connection:**
1. Azure Redis (primary/secondary connection strings)
2. Redis Cluster (`REDIS_CLUSTER_URLS`)
3. Standalone Redis (`REDIS_URL`)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Localized routes
│   └── api/               # API routes (health, revalidate)
├── components/            # React components
│   ├── blocks/            # CMS block components
│   ├── layout/            # Header, Footer
│   └── ui/                # Shadcn UI components
├── lib/
│   ├── cache/             # Redis cache handler
│   ├── engine/            # Block rendering engine
│   ├── i18n/              # Internationalization
│   └── strapi/            # CMS client utilities
└── middleware/            # Security + locale middleware
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Cache Invalidation

The `/api/revalidate` endpoint accepts webhooks from Strapi to invalidate cached content by tag.

Configure Strapi webhook:
- **URL**: `https://your-domain.com/api/revalidate`
- **Events**: entry.create, entry.update, entry.delete, entry.publish, entry.unpublish
- **Header**: `x-webhook-secret: <your-secret>`
