const express = require('express');

function transactionRoutes(controller, authMiddleware, validate, schemas) {
  const router = express.Router();

  router.use(authMiddleware);

  router.get('/sales', controller.listSales);
  router.post('/sales', validate(schemas.saleCreateSchema), controller.createSale);
  router.put('/sales/:id', controller.updateSale);
  router.delete('/sales/:id', controller.deleteSale);

  router.get('/purchases', controller.listPurchases);
  router.post('/purchases', validate(schemas.purchaseCreateSchema), controller.createPurchase);
  router.put('/purchases/:id', controller.updatePurchase);
  router.delete('/purchases/:id', controller.deletePurchase);

  router.get('/expenses', controller.listExpenses);
  router.post('/expenses', validate(schemas.expenseCreateSchema), controller.createExpense);
  router.put('/expenses/:id', controller.updateExpense);
  router.delete('/expenses/:id', controller.deleteExpense);

  router.get('/waste', controller.listWaste);
  router.post('/waste', validate(schemas.wasteCreateSchema), controller.createWaste);
  router.put('/waste/:id', controller.updateWaste);
  router.delete('/waste/:id', controller.deleteWaste);

  return router;
}

module.exports = transactionRoutes;
