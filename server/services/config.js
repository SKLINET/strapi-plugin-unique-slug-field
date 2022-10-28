"use strict";

module.exports = ({ strapi }) => {
  return {
    getConfig(key = "contentTypes") {
      return {
        contentTypes: [strapi.plugin("unique-slug-field").config(key) ?? {}],
      };
    },
  };
};
