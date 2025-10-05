"use strict";

/**
 * Global populate middleware
 * Auto-populates navigation, navigationItems with routes, and SEO components
 */

const populate = {
  navigation: true,
  navigationItems: {
    populate: {
      route: true, // Populate the route relation
    },
  },
  defaultSeo: true,
};

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    ctx.query = {
      populate,
      ...ctx?.query,
    };
    await next();
  };
};
