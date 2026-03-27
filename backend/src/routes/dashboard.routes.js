const express = require('express');

function dashboardRoutes(controller, authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);
  router.get('/overview', controller.getOverview);
  router.get('/search', controller.globalSearch);

  return router;
}

module.exports = dashboardRoutes;
