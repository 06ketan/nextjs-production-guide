# Next.js 15 + Strapi CMS Production Guide

Complete production-ready stack: Next.js 15 with custom Redis cache handler, Strapi v4 headless CMS, and Redis Cluster/Standalone support.

## ⚡ Key Features

- **79% Smaller Docker Images**: Multi-stage builds (850MB → 180MB)
- **Redis Cluster with Auto NAT Mapping**: Dynamic Docker IP resolution for localhost development
- **Tag-Based Cache Invalidation**: Surgical updates via CMS webhooks
- **i18n Ready**: English & Marathi locales with auto-detection
- **Health Monitoring**: Production endpoints + graceful degradation
- **CMS-Driven**: Dynamic zones, auto-populate middleware

## 📁 Project Structure

```
nextjs-production-guide/
├── cms/                    # Strapi v4 CMS (SQLite/Postgres)
├── frontend/               # Next.js 15 App Router + Redis cache handler
├── scripts/                # Utility scripts (RedisInsight setup)
├── docker-compose.local.yml           # Full stack (CMS + Frontend + Redis)
├── docker-compose.redis-only.yml     # Redis cluster + standalone + RedisInsight
├── start-local.sh          # One-command startup
└── QUICKSTART.md           # Quick start guide
```

## 🚀 Quick Start

### Option 1: Using the startup script (Recommended)

```bash
./start-local.sh
```

### Option 2: Using Docker Compose

```bash
# Full stack
docker compose -f docker-compose.local.yml up -d --build

# Redis only (for testing cache handler)
docker compose -f docker-compose.redis-only.yml up -d
```

## 🌐 Access Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | - |
| **CMS Admin** | http://localhost:1337/admin | Create on first visit |
| **RedisInsight** | http://localhost:8001 | - |
| **Redis Cluster** | localhost:7001-7006 | `dev-redis-password` |
| **Redis Standalone** | localhost:6380 | `dev-redis-password` |

## 🏗️ Architecture Highlights

### Redis Cache Handler
- **Automatic mode detection**: Cluster vs Standalone via env vars
- **Docker NAT mapping**: Dynamically resolves internal cluster IPs (172.x.x.x) to localhost ports
- **Graceful degradation**: App continues if Redis is unavailable
- **Tag-based invalidation**: Webhook-triggered cache updates

### Next.js Optimization
- **Custom cache handler** replaces in-memory cache with Redis (ISR, fetch cache, image optimization)
- **Standalone output**: 180MB production images vs 850MB standard builds
- **Health checks**: `/api/health` for container orchestration

### Strapi CMS
- **Auto-populate middleware**: No need for `populate=*` in queries
- **Dynamic zones**: Composable block-based content
- **Webhook integration**: Triggers Next.js revalidation on content changes

## 📚 Documentation

| File | Description |
|------|-------------|
| [QUICKSTART.md](./QUICKSTART.md) | Step-by-step setup guide |
| [frontend/README.md](./frontend/README.md) | Next.js architecture & Redis cache details |
| [cms/README.md](./cms/README.md) | Strapi content types & middleware |

## 🛑 Stop Services

```bash
# Press Ctrl+C if using start-local.sh

# Docker Compose
docker compose -f docker-compose.local.yml down
docker compose -f docker-compose.redis-only.yml down

# Remove volumes (clean slate)
docker compose -f docker-compose.local.yml down -v
```

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_AUTH` | `dev-redis-password` | Redis password for cluster & standalone |
| `REDIS_CLUSTER_URLS` | 6 node URLs | Comma-separated cluster endpoints |
| `REDIS_URL` | `redis://:pass@localhost:6380` | Standalone Redis URL |
| `STRAPI_URL` | `http://localhost:1337` | CMS API endpoint |

## 🐛 Troubleshooting

**Redis cluster connection fails:**
- Ensure Docker is running: `docker ps`
- Check logs: `docker compose -f docker-compose.redis-only.yml logs redis-cluster-init`
- The frontend auto-builds NAT map by connecting to each node

**CMS not seeding data:**
- Run: `cd cms && ./seed.sh`
- Check: `docker compose -f docker-compose.local.yml logs cms`

**Port conflicts:**
- Stop conflicting services: `lsof -ti :3000 | xargs kill -9`
- Change ports in `docker-compose.*.yml`
