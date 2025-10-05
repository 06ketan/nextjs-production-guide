"use strict";

/**
 * About populate middleware
 * Auto-populates all nested components
 */

const populate = {
  seo: true,
};

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    ctx.query = {
      populate,
      ...ctx.query,
    };
    await next();
  };
};

