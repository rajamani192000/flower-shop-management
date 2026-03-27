const express = require('express');

function creditRoutes(controller, authMiddleware, validate, schemas) {
  const router = express.Router();

  router.use(authMiddleware);

  router.get('/credit-sales', controller.listCreditSales);
  router.post('/credit-sales', validate(schemas.creditSaleCreateSchema), controller.createCreditSale);
  router.put('/credit-sales/:id', controller.updateCreditSale);
  router.delete('/credit-sales/:id', controller.deleteCreditSale);

  router.get('/credit-collections', controller.listCreditCollections);
  router.post('/credit-collections', validate(schemas.creditCollectionCreateSchema), controller.createCreditCollection);
  router.put('/credit-collections/:id', controller.updateCreditCollection);
  router.delete('/credit-collections/:id', controller.deleteCreditCollection);

  router.get('/credit/outstanding', controller.outstanding);
  router.get('/credit/customers', controller.customerSummaries);
  router.get('/credit/pending/:customerId', controller.pendingByCustomer);

  return router;
}

module.exports = creditRoutes;
