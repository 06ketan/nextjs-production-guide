# CMS Seed Instructions

## How to Seed Data into Strapi CMS

The seed script will create/update all pages, posts, and global settings from `src/seed/data.js`.

### Method 1: Using the Seed Script (Recommended)

```bash
cd /Users/ketan2.chavan/Desktop/cms
./seed.sh
```

This will:
- Start Strapi with `SEED_DATA=true`
- Automatically seed all data on bootstrap
- Create/update the FAQ Examples page
- Update navigation to include "FAQ Examples" link

### Method 2: Manual Seed

1. **Stop Strapi** if it's running (Ctrl+C)

2. **Set environment variable and start:**
   ```bash
   cd /Users/ketan2.chavan/Desktop/cms
   SEED_DATA=true npm run develop
   ```

3. **Wait for seed to complete** - you'll see logs like:
   ```
   [Seed] Starting data seed...
   [Seed] Created/Updated page: /faq-examples (en)
   [Seed] Updated global (en)
   [Seed] ✅ Data seeding complete!
   ```

4. **Stop Strapi** (Ctrl+C) and restart normally:
   ```bash
   npm run develop
   ```

## What Gets Seeded

- ✅ **Pages**: Home, About, Posts, FAQ Examples (new!)
- ✅ **Posts**: All blog posts in English and Marathi
- ✅ **Global Settings**: Navigation (includes FAQ Examples link)
- ✅ **About Page**: Single type content

## FAQ Examples Page

The FAQ Examples page includes:
- Hero block
- Rich text explanation
- FAQ Bad block (demonstrates bad SEO pattern)
- FAQ Good block (demonstrates good SEO pattern)

Access it at: `/en/faq-examples` or `/mr/faq-examples`

## Notes

- The seed script now **updates existing pages** instead of skipping
- If a page with the same `pathName` exists, it will be updated
- Navigation will be updated to include the FAQ Examples link
- All pages are published automatically

