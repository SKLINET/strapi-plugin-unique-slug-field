"use strict";

module.exports = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/available/:uid/:slug/:id",
      handler: "available.isAvailable",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/available/:uid/:slug/:id/:vuid",
      handler: "available.isAvailable",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
