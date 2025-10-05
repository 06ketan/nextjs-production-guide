"use strict";

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::about.about", {
  config: {
    find: {
      middlewares: ["api::about.about-populate"],
    },
  },
});
