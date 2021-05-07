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
     * Retrieve records of recipes.
     *
     * @return {Array}
     */
    async findCustom(ctx) {
        let entities
        if (ctx.query._q) {
            entities = await strapi.services.recipe.search(ctx.query);
        } else {
            entities = await strapi.services.recipe.find(ctx.query);
        }

        return entities.map(entity => {
            let recipe = sanitizeEntity(entity, { model: strapi.models.recipe })

            return {
                id: recipe.id,
                title: recipe.title,
                difficult: recipe.difficult,
                time_to_prepare: recipe.time_to_prepare,
                photography: recipe.photography 
                    ? recipe.photography[0].formats && recipe.photography[0].formats.small
                        ? recipe.photography[0].formats.small
                        : recipe.photography[0].formats.thumbnail 
                    : null
            }
        })
    },

    /**
     * Get info for filters
     */
    async getFiltersInfo() {
        let entitiesRecipes = await strapi.services.recipe.find();
        let entitiesCategories = await strapi.services.categories.find();

        let recipes = entitiesRecipes.map(entity => {
            let recipe = sanitizeEntity(entity, { model: strapi.models.recipe })

            return {
                id: recipe.id,
                time_to_prepare: recipe.time_to_prepare,
                ingredients: recipe.ingredients
            }
        })

        const arrayOfRecipesTime = recipes.map(recipe => recipe.time_to_prepare)
        const timeToPrepare = {
            min: Math.min(...arrayOfRecipesTime),
            max: Math.max(...arrayOfRecipesTime),
        }

        let ingredientsList = []
        if (recipes.length) {
            let ingredients = []

            recipes.forEach(recipe => {
                let curCat = recipe.ingredients.map(ingredient => {
                    return {
                        key: ingredient.key.toLowerCase(),
                    }
                })
                ingredients = ingredients.concat(curCat)
            })
            
            ingredientsList = Array.from(new Set(ingredients.map(cat => cat.key.trim())))
                .filter(item => item)
                .sort((a, b) => (a > b) ? 1 : ((b > a) ? -1 : 0))
        }

        const categories = entitiesCategories.map(entity => {
            let category = sanitizeEntity(entity, { model: strapi.models.categories })

            return {
                id: category.id,
                title: category.title
            }
        }).sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : ((b.title.toLowerCase() > a.title.toLowerCase()) ? -1 : 0))

        return {
            categories: categories,
            ingredients: ingredientsList,
            time: timeToPrepare
        }
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