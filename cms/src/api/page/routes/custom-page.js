"use strict";

/**
 * Custom routes for page API
 * GET /api/pages/names - Returns array of page pathNames and titles
 */
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/pages/names",
      handler: "page.names",
      config: {
        auth: false,
      },
    },
  ],
};
