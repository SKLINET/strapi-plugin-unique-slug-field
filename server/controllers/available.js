"use strict";
const { getService } = require("../utils");

module.exports = {
  async isAvailable(ctx) {
    const { uid, slug } = ctx.request.params;

    const { contentTypes } = await getService("config").getConfig();
    const supportedType = contentTypes[0].find(
      (type) => `api::${type.uid}.${type.uid}` === uid
    );
    const items = await strapi.entityService.findMany(uid, {
      filters: { [supportedType.field]: slug },
    });
    const allItems = await strapi.entityService.findMany(uid, {});
    const allVuids = items?.map((result) => result?.vuid);
    let uniqueVuid = allVuids.filter((c, index) => {
      return allVuids.indexOf(c) === index;
    });

    if (uniqueVuid?.length > 1) {
      return ctx.send(false);
    }

    ctx.send({ available: items[0]?.slug !== slug, vuid: allItems[0]?.vuid });
  },
};
