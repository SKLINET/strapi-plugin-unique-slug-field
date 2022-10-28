"use strict";

const { getService } = require("../utils");

const findUniqueUID = async (uid, field, value, vuid) => {
  const uidContent = await strapi.entityService.findMany(uid, {
    filters: { [field]: value },
  });
  const possibleColisions = uidContent.map((result) => result[field]);
  const allVuids = uidContent.map((result) => result.vuid);
  let uniqueVuid = allVuids.filter((c, index) => {
    return allVuids.indexOf(c) === index;
  });

  if (possibleColisions.length === 0 || uniqueVuid[0] === vuid) {
    return value;
  }

  let i = 1;
  let tmpUId = `${value}-${i}`;
  while (possibleColisions.includes(tmpUId)) {
    i += 1;
    tmpUId = `${value}-${i}`;
  }

  return tmpUId;
};

module.exports = {
  async findOne(ctx) {
    const { uid, id, slug } = ctx.request.params;
    const { contentTypes } = await getService("config").getConfig();
    const supportedType = contentTypes[0].find(
      (type) => `api::${type.uid}.${type.uid}` === uid
    );

    const entity = id
      ? await strapi.service(uid).findOne(id)
      : await strapi.service(uid).find();

    const referenceValue = entity[supportedType.references];
    const uniqueValue = slug;
    const vuid = entity.vuid || "";
    const field = supportedType.field;

    // Return empty object if requirements are not met.
    if (!supportedType || !entity) {
      return ctx.send({});
    }

    ctx.send({
      value: slug
        ? await findUniqueUID(uid, field, uniqueValue, vuid)
        : referenceValue,
      vuid: entity.vuid,
    });
  },
};
