# Quick Start Guide

## Prerequisites

- Docker & Docker Compose installed
- Ports available: 3000 (frontend), 1337 (CMS), 7001-7006 (Redis cluster), 6380 (Redis standalone), 8001 (RedisInsight)

## 1. Start Everything

**Option A: One-command startup (Recommended)**
```bash
./start-local.sh
```

**Option B: Docker Compose**
```bash
# Full stack (CMS + Frontend + Redis)
docker compose -f docker-compose.local.yml up -d --build

# Redis only (for cache handler testing)
docker compose -f docker-compose.redis-only.yml up -d
```

## 2. Wait for Services

```bash
# Watch startup logs
docker compose -f docker-compose.local.yml logs -f

# Check health
curl http://localhost:3000/api/health
```

Expected: `{"status":"ok","timestamp":"...","uptime":...}`

## 3. Access Services

| Service | URL | Notes |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Auto-connects to Redis cluster with NAT mapping |
| **CMS Admin** | http://localhost:1337/admin | Create admin user on first visit |
| **RedisInsight** | http://localhost:8001 | See connection steps below |

## 4. Seed CMS Data (Optional)

```bash
docker compose -f docker-compose.local.yml exec cms npm run develop

# Or from host
cd cms && ./seed.sh
```

## RedisInsight Connection

After RedisInsight starts (wait ~2 minutes for health check), connect to the cluster:

1. Open http://localhost:8001
2. Click "Add Redis Database"
3. Select "Redis Cluster"
4. Add master nodes:
   - Host: `redis-node-1`, Port: `6379`
   - Host: `redis-node-2`, Port: `6379`
   - Host: `redis-node-3`, Port: `6379`
5. Password: `dev-redis-password`
6. Click "Add Database"

**Standalone Redis:**
- Host: `redis-standalone`, Port: `6379`
- Password: `dev-redis-password`

## Verify Redis Connection

Frontend logs should show:
```
[Redis] 🔵 Creating Redis Cluster with 6 nodes
[Redis] 🔧 Building natMap for Docker localhost cluster...
[Redis] ✅ Built natMap: 6 mappings
[Redis] ✅ Redis Cluster is ready
```

Check cache:
```bash
# View cached keys
docker exec nextjs-production-guide-redis-node-1-1 redis-cli -a dev-redis-password keys "NEXTJS_GUIDE:*"

# Test cache invalidation
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: your-secret" \
  -d '{"model":"page","entry":{"id":1}}'
```

## Useful Commands

```bash
# Check logs
docker compose -f docker-compose.local.yml logs -f
docker compose -f docker-compose.local.yml logs -f frontend
docker compose -f docker-compose.local.yml logs -f cms
docker compose -f docker-compose.local.yml logs -f redis-cluster-init

# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}"

# Restart specific service
docker compose -f docker-compose.local.yml restart frontend

# Exec into container
docker compose -f docker-compose.local.yml exec frontend sh
docker compose -f docker-compose.local.yml exec cms sh
```

## Stop Services

```bash
# Stop all
docker compose -f docker-compose.local.yml down

# Stop Redis only
docker compose -f docker-compose.redis-only.yml down

# Clean slate (removes volumes)
docker compose -f docker-compose.local.yml down -v
```

## Troubleshooting

**Frontend can't connect to Redis cluster:**
- Check cluster health: `docker exec nextjs-production-guide-redis-node-1-1 redis-cli -a dev-redis-password cluster info`
- Expected: `cluster_state:ok`
- Frontend auto-builds NAT map dynamically, no config needed

**CMS admin not loading:**
- Check logs: `docker compose -f docker-compose.local.yml logs cms`
- Try: `docker compose -f docker-compose.local.yml restart cms`

**Port already in use:**
```bash
# Find and kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or change port in docker-compose.local.yml
```

## Next Steps

1. Explore frontend at http://localhost:3000
2. Add content in CMS at http://localhost:1337/admin
3. Set up webhook for cache invalidation (Settings → Webhooks in CMS)
4. See [frontend/README.md](./frontend/README.md) for Redis cache details
5. See [cms/README.md](./cms/README.md) for content type documentation
