#!/bin/bash

# Seed script for Strapi CMS
# This will seed/update all data from seed/data.js

echo "🌱 Starting CMS seed process..."
echo ""
echo "This will:"
echo "  - Create/update pages (including FAQ Examples)"
echo "  - Create/update posts"
echo "  - Create/update global settings (including navigation)"
echo "  - Create/update about page"
echo ""
echo "⚠️  Make sure Strapi is NOT running before proceeding"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Set SEED_DATA environment variable and start Strapi
export SEED_DATA=true

echo ""
echo "Starting Strapi with seed enabled..."
echo "The seed will run automatically on bootstrap."
echo ""
echo "After Strapi starts, you can stop it (Ctrl+C) and restart normally."
echo ""

npm run develop

