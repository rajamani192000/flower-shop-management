const express = require('express');

function inventoryRoutes(controller, authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);
  router.get('/status', controller.stockStatus);

  return router;
}

module.exports = inventoryRoutes;
