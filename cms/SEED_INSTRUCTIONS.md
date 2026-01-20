# CMS Seed Instructions

## How to Seed Data into Strapi CMS

The seed script creates/updates all pages, posts, and global settings from `src/seed/data.js`.

### Method 1: Using the Seed Script (Recommended)

```bash
cd cms
./seed.sh
```

**What it does:**
- Starts Strapi with `SEED_DATA=true` env var
- Auto-seeds all data on bootstrap
- Creates/updates FAQ Examples page
- Updates navigation to include "FAQ Examples" link

### Method 2: Manual Seed

1. **Stop Strapi** (Ctrl+C if running)

2. **Set env var and start:**
   ```bash
   cd cms
   SEED_DATA=true npm run develop
   ```

3. **Wait for seed completion** - logs will show:
   ```
   [Seed] Starting data seed...
   [Seed] Created/Updated page: /faq-examples (en)
   [Seed] Updated global (en)
   [Seed] ✅ Data seeding complete!
   ```

4. **Restart normally** (Ctrl+C, then `npm run develop`)

### Method 3: Docker

```bash
# From project root
docker compose -f docker-compose.local.yml exec cms sh -c "SEED_DATA=true npm run develop"
```

## What Gets Seeded

| Content Type | Items | Locales |
|--------------|-------|---------|
| **Pages** | Home, About, Posts, FAQ Examples | en, mr |
| **Posts** | Multiple blog posts with cover images | en, mr |
| **Global Settings** | Navigation, SEO defaults | en, mr |
| **About Page** | Single type content | en, mr |
| **Routes** | Navigation link definitions | - |

## Content Examples

**FAQ Examples Page:**
- Hero block with title/subtitle
- Rich text explanation
- FAQ Bad block (bad SEO pattern demo)
- FAQ Good block (good SEO pattern demo)

**Access:** `/en/faq-examples` or `/mr/faq-examples`

**Posts:**
- Cover images with alt text
- Multiple content blocks (hero, features, rich text)
- Tags for categorization
- SEO metadata

## Seed Behavior

- **Upsert logic**: Updates existing content by `pathName` or slug
- **Auto-publish**: All seeded content is published
- **Navigation updates**: Adds/updates navigation items
- **Idempotent**: Safe to run multiple times

## Verify Seeded Data

```bash
# Check pages
curl http://localhost:1337/api/pages?locale=en

# Check posts
curl http://localhost:1337/api/posts?locale=en

# Check global settings
curl http://localhost:1337/api/global?locale=en
```

## Troubleshooting

**Seed doesn't run:**
- Ensure `SEED_DATA=true` is set
- Check logs for `[Seed]` prefix messages
- Verify `src/seed/data.js` exists

**Duplicate content:**
- Seed uses upsert by `pathName`/slug
- Delete duplicates via CMS admin
- Re-run seed to fix

**Missing images:**
- Images are seeded as external URLs
- Upload local images via CMS admin if needed