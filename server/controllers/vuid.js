"use strict";

module.exports = {
  async getVuid(ctx) {
    const { uid, id } = ctx.request.params;

    const entity = await strapi.service(uid).findOne(id);
    if (entity?.vuid) {
      console.log("sending vuid");
      ctx.send(entity?.vuid);
    } else {
      console.log("not sending vuid");
      ctx.send({});
    }
  },
};
