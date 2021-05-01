const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

    async comment(ctx) {
        let entity;
        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.comments.create(data, { files });
        } else {
            ctx.request.body.author = ctx.state.user.id;
            ctx.request.body.recipe = ctx.params.id;

            entity = await strapi.services.comments.create(ctx.request.body);
        }
        return sanitizeEntity(entity, { model: strapi.models.comments });
    },
};