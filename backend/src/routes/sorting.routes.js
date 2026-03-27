const express = require('express');

function sortingRoutes(controller, authMiddleware, validate, schema) {
  const router = express.Router();

  router.use(authMiddleware);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', validate(schema), controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}

module.exports = sortingRoutes;
