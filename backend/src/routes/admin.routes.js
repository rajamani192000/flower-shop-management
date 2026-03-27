const express = require('express');

function adminRoutes(controller, authMiddleware, roleMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);
  if (roleMiddleware) {
    router.use(roleMiddleware('Admin'));
  }
  router.post('/initialize', controller.initializeDatabase);

  return router;
}

module.exports = adminRoutes;
