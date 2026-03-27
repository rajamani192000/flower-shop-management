function transactionControllerFactory(transactionService) {
  return {
    listSales: async (req, res, next) => {
      try {
        res.json({ data: await transactionService.list('sales', req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    createSale: async (req, res, next) => {
      try {
        res.status(201).json({ data: await transactionService.createSale(req.body, req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    updateSale: async (req, res, next) => {
      try {
        res.json({ data: await transactionService.updateSale(String(req.params.id), req.body, req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    deleteSale: async (req, res, next) => {
      try {
        await transactionService.deleteSale(String(req.params.id), req.user.shopId);
        res.json({ message: 'Deleted' });
      } catch (error) {
        next(error);
      }
    },

    listPurchases: async (req, res, next) => {
      try {
        res.json({ data: await transactionService.list('purchases', req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    createPurchase: async (req, res, next) => {
      try {
        res.status(201).json({ data: await transactionService.createPurchase(req.body, req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    updatePurchase: async (req, res, next) => {
      try {
        res.json({ data: await transactionService.updatePurchase(String(req.params.id), req.body, req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    deletePurchase: async (req, res, next) => {
      try {
        await transactionService.deletePurchase(String(req.params.id), req.user.shopId);
        res.json({ message: 'Deleted' });
      } catch (error) {
        next(error);
      }
    },

    listExpenses: async (req, res, next) => {
      try {
        res.json({ data: await transactionService.list('expenses', req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    createExpense: async (req, res, next) => {
      try {
        res.status(201).json({ data: await transactionService.createExpense(req.body, req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    updateExpense: async (req, res, next) => {
      try {
        res.json({ data: await transactionService.updateExpense(String(req.params.id), req.body, req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    deleteExpense: async (req, res, next) => {
      try {
        await transactionService.deleteExpense(String(req.params.id), req.user.shopId);
        res.json({ message: 'Deleted' });
      } catch (error) {
        next(error);
      }
    },

    listWaste: async (req, res, next) => {
      try {
        res.json({ data: await transactionService.list('waste', req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    createWaste: async (req, res, next) => {
      try {
        res.status(201).json({ data: await transactionService.createWaste(req.body, req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    updateWaste: async (req, res, next) => {
      try {
        res.json({ data: await transactionService.updateWaste(String(req.params.id), req.body, req.user.shopId) });
      } catch (error) {
        next(error);
      }
    },
    deleteWaste: async (req, res, next) => {
      try {
        await transactionService.deleteWaste(String(req.params.id), req.user.shopId);
        res.json({ message: 'Deleted' });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = transactionControllerFactory;
