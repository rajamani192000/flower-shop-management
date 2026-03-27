const express = require('express');

function resourceRoutes(controller, authMiddleware, options = {}) {
  const router = express.Router();

  router.use(authMiddleware);

  if (options.roleMiddleware && Array.isArray(options.roles) && options.roles.length > 0) {
    router.use(options.roleMiddleware(...options.roles));
  }

  if (options.validateCreate) {
    router.post('/', options.validateCreate, controller.create);
  } else {
    router.post('/', controller.create);
  }

  router.get('/', controller.list);
  router.get('/:id', controller.getById);

  if (options.validateUpdate) {
    router.put('/:id', options.validateUpdate, controller.update);
  } else {
    router.put('/:id', controller.update);
  }

  router.delete('/:id', controller.remove);

  return router;
}

module.exports = resourceRoutes;
