"use strict";

/**
 * Page populate middleware
 * Auto-populates blocks and nested components
 */

const populate = {
  blocks: {
    populate: {
      // Hero block
      backgroundImage: true,
      ctaButton: {
        populate: {
          icon: true,
        },
      },
      // Feature card
      icon: true,
      image: true,
      // Features section - populate nested features
      features: true,
      // FAQ
      faqs: true,
      // Banner
      ctaLink: true,
      // Post list - populate related posts
      posts: {
        populate: {
          cover: true,
          seo: true,
        },
      },
    },
  },
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

