"use strict";

module.exports = {
  getConfig: async (ctx) => {
    const { body } = ctx.request;
    const config = await strapi
      .plugin("unique-slug-field")
      .service("config")
      .getConfig();
    ctx.send(config);
  },
};
