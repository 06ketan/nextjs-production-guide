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

The custom cache handler (`src/lib/cache/cache-handler.ts`) replaces Next.js default in-memory cache with Redis, supporting distributed deployments.

**Key Features:**
- **Automatic mode detection**: Cluster vs Standalone via env vars
- **Docker NAT mapping**: Dynamically resolves internal Docker IPs (e.g., `172.19.0.x:6379`) to `localhost:700x`
- **Graceful degradation**: App continues if Redis is unavailable (60s retry backoff)
- **Tag-based invalidation**: Surgical cache updates via webhooks

**Build the cache handler:**

```bash
npm run build:cache  # Compiles TypeScript to .cache-handler/
npm run build        # Includes build:cache + Next.js build
```

**Connection priority:**
1. Azure Redis (primary/secondary connection strings)
2. Redis Cluster (`REDIS_CLUSTER_URLS`) - auto-builds NAT map for Docker
3. Standalone Redis (`REDIS_URL`)

**Docker Cluster NAT Mapping:**

When connecting to Redis Cluster from outside Docker, the cluster reports internal IPs unreachable from the host. The cache handler automatically:

1. Connects to each startup node individually
2. Queries `CLUSTER NODES` to get internal Docker IP
3. Builds mapping: `internal_ip:port → localhost:external_port`
4. Passes `natMap` to ioredis Cluster constructor

**Example logs:**
```
[Redis] 🔵 Creating Redis Cluster with 6 nodes
[Redis] 🔧 Building natMap for Docker localhost cluster...
[Redis] ✅ Built natMap: 6 mappings
[Redis] ✅ Redis Cluster is ready
```

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
