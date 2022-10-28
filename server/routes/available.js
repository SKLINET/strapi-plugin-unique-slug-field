"use strict";

module.exports = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/available/:uid/:slug",
      handler: "available.isAvailable",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
  ],
};
