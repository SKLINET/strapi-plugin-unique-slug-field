"use strict";

module.exports = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/config",
      handler: "config.getConfig",
      config: { policies: [], auth: false },
    },
  ],
};
