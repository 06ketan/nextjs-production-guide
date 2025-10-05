"use strict";

const seedData = require("./seed/data");

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    const shouldSeed = process.env.SEED_DATA === "true";

    if (!shouldSeed) {
      console.log("[Seed] Skipping seed. Set SEED_DATA=true to seed.");
      return;
    }

    console.log("[Seed] Starting data seed...");

    try {
      await ensureLocales(strapi);
      await setupPublicPermissions(strapi);
      const routeIds = await seedRoutes(strapi);
      await seedGlobal(strapi, routeIds);
      await seedAbout(strapi);
      await seedPages(strapi);
      await seedPosts(strapi);
      console.log("[Seed] ✅ Data seeding complete!");
    } catch (error) {
      console.error("[Seed] ❌ Error seeding data:", error);
    }
  },
};

async function ensureLocales(strapi) {
  const localeService = strapi.plugin("i18n").service("locales");
  const existingLocales = await localeService.find();
  const existingCodes = existingLocales.map((l) => l.code);

  if (!existingCodes.includes("mr")) {
    await localeService.create({ code: "mr", name: "Marathi" });
    console.log("[Seed] Created Marathi locale");
  }
}

async function setupPublicPermissions(strapi) {
  // Get the public role
  const publicRole = await strapi.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
  });

  if (!publicRole) {
    console.log("[Seed] Public role not found");
    return;
  }

  // Define which actions to enable for each content type
  const contentTypes = ["page", "post", "about", "global", "route"];
  const actions = ["find", "findOne"];

  // Get all permissions for the public role
  const permissions = await strapi.query("plugin::users-permissions.permission").findMany({
    where: { role: publicRole.id },
  });

  for (const contentType of contentTypes) {
    for (const action of actions) {
      const permissionAction = `api::${contentType}.${contentType}.${action}`;
      
      // Check if permission already exists
      const existingPermission = permissions.find((p) => p.action === permissionAction);
      
      if (!existingPermission) {
        // Create the permission
        await strapi.query("plugin::users-permissions.permission").create({
          data: {
            action: permissionAction,
            role: publicRole.id,
          },
        });
      } else if (!existingPermission.enabled) {
        // Enable the permission
        await strapi.query("plugin::users-permissions.permission").update({
          where: { id: existingPermission.id },
          data: { enabled: true },
        });
      }
    }
  }

  console.log("[Seed] Public API permissions configured");
}

async function seedRoutes(strapi) {
  const routeIds = {};
  
  for (const routeData of seedData.routes) {
    const existing = await strapi.entityService.findMany("api::route.route", {
      filters: { path: routeData.path },
    });

    let route;
    if (existing && existing.length > 0) {
      route = await strapi.entityService.update("api::route.route", existing[0].id, {
        data: routeData,
      });
      console.log(`[Seed] Updated route: ${routeData.path}`);
    } else {
      route = await strapi.entityService.create("api::route.route", {
        data: routeData,
      });
      console.log(`[Seed] Created route: ${routeData.path}`);
    }
    
    routeIds[routeData.path] = route.id;
  }

  console.log("[Seed] Routes seeded");
  return routeIds;
}

async function seedGlobal(strapi, routeIds = {}) {
  // Build navigation items from routes
  const navigationItemsEn = [
    { label: "Home", route: routeIds["/"], order: 0 },
    { label: "Posts", route: routeIds["/posts"], order: 1 },
    { label: "About", route: routeIds["/about"], order: 2 },
    { label: "FAQ Examples", route: routeIds["/faq-examples"], order: 3 },
  ];

  const navigationItemsMr = [
    { label: "मुख्यपृष्ठ", route: routeIds["/"], order: 0 },
    { label: "लेख", route: routeIds["/posts"], order: 1 },
    { label: "बद्दल", route: routeIds["/about"], order: 2 },
    { label: "FAQ उदाहरणे", route: routeIds["/faq-examples"], order: 3 },
  ];

  // Handle English
  const existingEn = await strapi.entityService.findMany("api::global.global", {
    locale: "en",
  });

  const globalDataEn = {
    ...seedData.global.en,
    navigationItems: navigationItemsEn,
    locale: "en",
  };

  if (existingEn && existingEn.length > 0) {
    // Update existing
    await strapi.entityService.update("api::global.global", existingEn[0].id, {
      data: globalDataEn,
    });
    console.log("[Seed] Updated global (en)");
  } else {
    // Create new
  await strapi.entityService.create("api::global.global", {
      data: globalDataEn,
    });
    console.log("[Seed] Created global (en)");
  }

  // Handle Marathi
  const existingMr = await strapi.entityService.findMany("api::global.global", {
    locale: "mr",
  });

  const globalDataMr = {
      ...seedData.global.mr,
    navigationItems: navigationItemsMr,
      locale: "mr",
  };

  if (existingMr && existingMr.length > 0) {
    // Update existing
    await strapi.entityService.update("api::global.global", existingMr[0].id, {
      data: globalDataMr,
  });
    console.log("[Seed] Updated global (mr)");
  } else {
    // Create new
    await strapi.entityService.create("api::global.global", {
      data: globalDataMr,
    });
    console.log("[Seed] Created global (mr)");
  }
}

async function seedAbout(strapi) {
  const existing = await strapi.entityService.findMany("api::about.about", {
    locale: "en",
  });

  if (existing) {
    console.log("[Seed] About already exists, skipping...");
    return;
  }

  // Create English
  await strapi.entityService.create("api::about.about", {
    data: {
      ...seedData.about.en,
      locale: "en",
      publishedAt: new Date(),
    },
  });

  // Create Marathi
  await strapi.entityService.create("api::about.about", {
    data: {
      ...seedData.about.mr,
      locale: "mr",
      publishedAt: new Date(),
    },
  });

  console.log("[Seed] About created");
}

async function seedPages(strapi) {
  // Create/update English pages
  for (const pageData of seedData.pages.en) {
  const existing = await strapi.entityService.findMany("api::page.page", {
      filters: { pathName: pageData.pathName },
    locale: "en",
  });

  if (existing && existing.length > 0) {
      // Update existing page
      await strapi.entityService.update("api::page.page", existing[0].id, {
        data: {
          ...pageData,
          locale: "en",
          publishedAt: existing[0].publishedAt || new Date(),
        },
      });
      console.log(`[Seed] Updated page: ${pageData.pathName} (en)`);
    } else {
      // Create new page
    await strapi.entityService.create("api::page.page", {
      data: {
          ...pageData,
        locale: "en",
        publishedAt: new Date(),
      },
    });
      console.log(`[Seed] Created page: ${pageData.pathName} (en)`);
    }
  }

  // Create/update Marathi pages
  for (const pageData of seedData.pages.mr) {
    const existing = await strapi.entityService.findMany("api::page.page", {
      filters: { pathName: pageData.pathName },
      locale: "mr",
    });

    if (existing && existing.length > 0) {
      // Update existing page
      await strapi.entityService.update("api::page.page", existing[0].id, {
        data: {
          ...pageData,
          locale: "mr",
          publishedAt: existing[0].publishedAt || new Date(),
        },
      });
      console.log(`[Seed] Updated page: ${pageData.pathName} (mr)`);
    } else {
      // Create new page
    await strapi.entityService.create("api::page.page", {
      data: {
          ...pageData,
        locale: "mr",
        publishedAt: new Date(),
      },
    });
      console.log(`[Seed] Created page: ${pageData.pathName} (mr)`);
    }
  }

  console.log("[Seed] Pages seeded/updated");
}

async function seedPosts(strapi) {
  const existing = await strapi.entityService.findMany("api::post.post", {
    locale: "en",
  });

  if (existing && existing.length > 0) {
    console.log("[Seed] Posts already exist, skipping...");
    return;
  }

  // Create English posts
  for (const post of seedData.posts.en) {
    await strapi.entityService.create("api::post.post", {
      data: {
        ...post,
        locale: "en",
        publishedAt: new Date(),
      },
    });
  }

  // Create Marathi posts
  for (const post of seedData.posts.mr) {
    await strapi.entityService.create("api::post.post", {
      data: {
        ...post,
        locale: "mr",
        publishedAt: new Date(),
      },
    });
  }

  console.log("[Seed] Posts created");
}
