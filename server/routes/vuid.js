"use strict";

module.exports = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/vuid/:uid/:id",
      handler: "vuid.getVuid",
      config: {
        policies: ["admin::isAuthenticatedAdmin"],
      },
    },
  ],
};
