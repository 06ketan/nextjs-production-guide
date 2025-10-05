"use strict";

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::post.post", {
  config: {
    find: {
      middlewares: ["api::post.post-populate"],
    },
    findOne: {
      middlewares: ["api::post.post-populate"],
    },
  },
});
