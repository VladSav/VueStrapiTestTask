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

    /**
     * Update likes in recipe
     *
     * @return {Object}
     */
     async likes(ctx) {
        let entity;
        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.recipe.update({ id: ctx.params.id }, data, {
                files,
            });
        } else {
            let s = await strapi.services.recipe.findOne({ id: ctx.params.id });
            console.log(s.likes)
            entity = await strapi.services.recipe.update({ id: ctx.params.id }, {
                likes: (s.likes || 0) + 1
            });
        }
    
        return sanitizeEntity(entity, { model: strapi.models.recipe });
    },
};