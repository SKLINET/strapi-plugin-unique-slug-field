"use strict";
const { getService } = require("../utils");

module.exports = {
  async isAvailable(ctx) {
    const { uid, slug, vuid } = ctx.request.params;
    const { contentTypes } = await getService("config").getConfig();
    const supportedType = contentTypes[0].find(
      (type) => `api::${type.uid}.${type.uid}` === uid
    );

    const items = await strapi.entityService.findMany(uid, {
      filters: { [supportedType.field]: slug },
    });

    if (items?.length === 0) {
      console.log("equals 0");
      vuid
        ? ctx.send({ available: true, vuid: vuid })
        : ctx.send({ available: true });
    }

    if (items?.length > 0) {
      console.log("equals > 0");
      if (vuid) {
        console.log("equals > 0 and has VUID");
        const allVuids = items?.map((item) => item?.vuid);
        const allEqual = allVuids.every((val) => val === allVuids[0]);
        const sameVuids = allVuids[0] === vuid;
        if (allEqual && sameVuids) {
          return ctx.send({ available: true, vuid: vuid });
        }
      } else {
        console.log("equals > 0 and does not have VUID");
        return ctx.send({ available: false });
      }
    }

    // if (vuid) {
    //   if (items?.length > 0) {
    //     const allVuids = items?.map((item) => item?.vuid);
    //     const allEqual = allVuids.every((val) => val === allVuids[0]);
    //     const sameVuids = allVuids[0] === vuid;
    //     if (allEqual && sameVuids) {
    //       return ctx.send({ available: true, vuid: vuid });
    //     }
    //   }
    // }

    // if (items?.length === 0) {
    //   return ctx.send({ available: true });
    // } else {
    //   return ctx.send({ available: false });
    // }
  },
};
