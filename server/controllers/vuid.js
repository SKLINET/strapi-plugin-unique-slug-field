"use strict";

module.exports = {
  async getVuid(ctx) {
    const { uid, id } = ctx.request.params;

    const entity = await strapi.service(uid).findOne(id);
    console.log(entity);
    ctx.send({ vuid: entity?.vuid });
  },
};
