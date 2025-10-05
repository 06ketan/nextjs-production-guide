# Quick Start Guide

## Start Everything

```bash
cd nextjs-strapi-startup-example
docker compose -f docker-compose.local.yml up -d --build
```

Or use the convenience script:

```bash
cd nextjs-strapi-startup-example
./start-local.sh
```

## Access Services

- **Frontend**: http://localhost:3000
- **CMS Admin**: http://localhost:1337/admin
- **RedisInsight**: http://localhost:8001

## RedisInsight Connection

After RedisInsight starts (wait ~30 seconds), connect to the cluster:

1. Open http://localhost:8001
2. Click "Add Redis Database"
3. Select "Redis Cluster"
4. Add these master nodes:
   - `redis-node-1:6379`
   - `redis-node-2:6379`
   - `redis-node-3:6379`
5. Password: `dev-redis-password` (or your `REDIS_AUTH` value)

## Check Logs

```bash
# All services
docker compose -f docker-compose.local.yml logs -f

# Specific service
docker compose -f docker-compose.local.yml logs -f frontend
docker compose -f docker-compose.local.yml logs -f cms
docker compose -f docker-compose.local.yml logs -f redis-cluster-init
```

## Stop Everything

```bash
docker compose -f docker-compose.local.yml down
```

## Clean Start (remove volumes)

```bash
docker compose -f docker-compose.local.yml down -v
```
