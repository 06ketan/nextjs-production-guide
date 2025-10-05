# Next.js + Strapi Startup Example

A complete local development setup with Next.js frontend, Strapi CMS, and Redis cluster.

## 📁 Project Structure

```
nextjs-strapi-startup-example/
├── cms/                    # Strapi CMS backend
├── frontend/               # Next.js frontend application
├── scripts/                # Utility scripts
├── docker-compose.local.yml           # Full stack Docker setup
├── docker-compose.redis-only.yml     # Redis cluster only
├── start-local.sh          # Convenience startup script
└── QUICKSTART.md           # Quick start guide
```

## 🚀 Quick Start

### Option 1: Using the startup script (Recommended)

```bash
cd nextjs-strapi-startup-example
./start-local.sh
```

### Option 2: Using Docker Compose

```bash
cd nextjs-strapi-startup-example
docker compose -f docker-compose.local.yml up -d --build
```

## 🌐 Access Services

- **Frontend**: http://localhost:3000
- **CMS Admin**: http://localhost:1337/admin
- **RedisInsight**: http://localhost:8001
- **Redis Cluster**: localhost:7001-7006
- **Redis Standalone**: localhost:6380

## 📚 Documentation

See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions.

## 🛑 Stop Services

```bash
# If using start-local.sh, press Ctrl+C

# If using Docker Compose
docker compose -f docker-compose.local.yml down
# or
docker compose -f docker-compose.redis-only.yml down
```

## 🔧 Environment Variables

Default Redis password: `dev-redis-password`

Set custom password:
```bash
export REDIS_AUTH=your-password
```
