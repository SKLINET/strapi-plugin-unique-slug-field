"use strict";

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "unique-slug",
    plugin: "unique-slug-field",
    type: "string",
  });
};
