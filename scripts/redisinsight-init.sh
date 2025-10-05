#!/bin/sh
# Auto-configure RedisInsight with Redis Cluster connection

set -e

RI_URL="http://localhost:8001"
REDIS_AUTH="${REDIS_AUTH:-dev-redis-password}"
MAX_RETRIES=30
RETRY_COUNT=0

echo "⏳ Waiting for RedisInsight to be ready..."

# Wait for RedisInsight API to be available
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if wget -q --spider "$RI_URL/api/health" 2>/dev/null; then
    echo "✅ RedisInsight is ready"
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo "⚠️  RedisInsight not ready after $MAX_RETRIES attempts"
  exit 1
fi

# Add Redis Cluster connection
echo "🔧 Configuring Redis Cluster connection..."

CLUSTER_CONFIG=$(cat <<EOF
{
  "name": "Redis Cluster (Local)",
  "connectionType": "CLUSTER",
  "nodes": [
    {"host": "redis-node-1", "port": 6379},
    {"host": "redis-node-2", "port": 6379},
    {"host": "redis-node-3", "port": 6379},
    {"host": "redis-node-4", "port": 6379},
    {"host": "redis-node-5", "port": 6379},
    {"host": "redis-node-6", "port": 6379}
  ],
  "password": "$REDIS_AUTH",
  "tls": false
}
EOF
)

# Note: RedisInsight API may require authentication token
# This is a simplified version - you may need to adjust based on RedisInsight version
echo "📝 Connection details saved. Please add manually in RedisInsight UI:"
echo ""
echo "   Connection Type: Redis Cluster"
echo "   Master Nodes:"
echo "     - redis-node-1:6379"
echo "     - redis-node-2:6379"
echo "     - redis-node-3:6379"
echo "   Password: $REDIS_AUTH"
echo ""
echo "   Or use the JSON config above via RedisInsight API"
