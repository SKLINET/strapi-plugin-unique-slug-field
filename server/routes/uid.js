"use strict";

module.exports = {
  type: "admin",
  routes: [
    {
      method: "GET",
      path: "/uid/:uid/:id/:slug",
      handler: "uid.findOne",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/uid/:uid/:id",
      handler: "uid.findOne",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/uid/:uid",
      handler: "uid.findOne",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
