#!/bin/bash
# Start Redis cluster + RedisInsight, then build & start CMS + Frontend locally

set -e

REDIS_AUTH="${REDIS_AUTH:-dev-redis-password}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting local development stack..."
echo ""

# Step 1: Start Redis cluster + RedisInsight
echo "📦 Starting Redis cluster + RedisInsight..."
if docker compose -f "$SCRIPT_DIR/docker-compose.redis-only.yml" up -d; then
  echo "✅ Redis cluster started"
  echo "   - Redis nodes: localhost:7001-7006"
  echo "   - RedisInsight: http://localhost:8001"
  echo ""
else
  echo "❌ Failed to start Docker. Is Docker Desktop running?"
  exit 1
fi

# Wait a bit for cluster init
echo "⏳ Waiting for cluster initialization..."
sleep 5

# Step 2: Set environment variables for local apps
export REDIS_AUTH="$REDIS_AUTH"
export REDIS_CLUSTER_URLS="redis://localhost:7001,redis://localhost:7002,redis://localhost:7003,redis://localhost:7004,redis://localhost:7005,redis://localhost:7006"
export STRAPI_URL="http://localhost:1337"
export REDIS_CACHE_DEBUG="true"

echo "🔧 Environment variables set:"
echo "   REDIS_CLUSTER_URLS=$REDIS_CLUSTER_URLS"
echo "   STRAPI_URL=$STRAPI_URL"
echo ""

# Step 3: Build & start CMS
echo "📦 Building CMS..."
cd "$SCRIPT_DIR/cms"
npm run build || echo "⚠️  CMS build failed (may not have build script)"
echo "🚀 Starting CMS..."
npm run start &
CMS_PID=$!
echo "   CMS PID: $CMS_PID"
echo "   CMS: http://localhost:1337"
echo ""

# Step 4: Build & start Frontend
echo "📦 Building Frontend..."
cd "$SCRIPT_DIR/frontend"
npm run build
echo "🚀 Starting Frontend..."
npm run start &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
echo "   Frontend: http://localhost:3000"
echo ""

echo "✅ All services started!"
echo ""
echo "📊 Services:"
echo "   - Redis Cluster: localhost:7001-7006"
echo "   - RedisInsight: http://localhost:8001"
echo "   - CMS: http://localhost:1337"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "🛑 To stop:"
echo "   docker compose -f $SCRIPT_DIR/docker-compose.redis-only.yml down"
echo "   kill $CMS_PID $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   CMS: tail -f $SCRIPT_DIR/cms/logs/*.log (if exists)"
echo "   Frontend: Check terminal output"
echo ""

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $CMS_PID $FRONTEND_PID 2>/dev/null; docker compose -f $SCRIPT_DIR/docker-compose.redis-only.yml down; exit" INT TERM

wait
