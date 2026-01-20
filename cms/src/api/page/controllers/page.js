"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::page.page", ({ strapi }) => ({
  /**
   * GET /api/pages/names
   * Returns array of page pathNames: ["", "about", "posts", "faq-examples"]
   */
  async names(ctx) {
    const { locale = "en" } = ctx.query;

    const pages = await strapi.entityService.findMany("api::page.page", {
      fields: ["pathName", "title"],
      filters: { publishedAt: { $notNull: true } },
      locale,
    });

    const names = pages.map((page) => ({
      pathName: page.pathName,
      title: page.title,
    }));

    return { data: names };
  },
}));

