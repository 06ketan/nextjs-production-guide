"use strict";

/**
 * Post populate middleware
 * Auto-populates blocks and nested components
 */

const populate = {
  cover: true,
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
      // FAQ
      faqs: true,
      // Banner
      ctaLink: true,
      // Story block
      sections: {
        populate: {
          image: true,
        },
      },
      // Rich text - no nested populate needed
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

