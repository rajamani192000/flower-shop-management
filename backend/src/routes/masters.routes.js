const express = require('express');

function mastersRoutes(controller, authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);
  router.get('/flowers', controller.listFlowers);
  router.get('/customers', controller.listCustomers);
  router.get('/suppliers', controller.listSuppliers);

  return router;
}

module.exports = mastersRoutes;
