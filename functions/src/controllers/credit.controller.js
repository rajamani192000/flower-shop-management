function creditControllerFactory(creditService, creditSalesResource, creditCollectionsResource) {
  return {
    listCreditSales: async (req, res, next) => {
      try {
        const data = await creditSalesResource.list(req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    createCreditSale: async (req, res, next) => {
      try {
        const data = await creditService.createCreditSale(req.body, req.user.shopId);
        res.status(201).json({ data });
      } catch (error) {
        next(error);
      }
    },
    updateCreditSale: async (req, res, next) => {
      try {
        const data = await creditSalesResource.update(String(req.params.id), req.body, req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    deleteCreditSale: async (req, res, next) => {
      try {
        await creditSalesResource.remove(String(req.params.id), req.user.shopId);
        res.json({ message: 'Deleted' });
      } catch (error) {
        next(error);
      }
    },

    listCreditCollections: async (req, res, next) => {
      try {
        const data = await creditCollectionsResource.list(req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    createCreditCollection: async (req, res, next) => {
      try {
        const data = await creditService.createCreditCollection(req.body, req.user.shopId);
        res.status(201).json({ data });
      } catch (error) {
        next(error);
      }
    },
    updateCreditCollection: async (req, res, next) => {
      try {
        const data = await creditCollectionsResource.update(String(req.params.id), req.body, req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    deleteCreditCollection: async (req, res, next) => {
      try {
        await creditCollectionsResource.remove(String(req.params.id), req.user.shopId);
        res.json({ message: 'Deleted' });
      } catch (error) {
        next(error);
      }
    },

    outstanding: async (req, res, next) => {
      try {
        const data = await creditService.getOutstanding(req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },

    customerSummaries: async (req, res, next) => {
      try {
        const data = await creditService.getCustomerSummaries(req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },

    pendingByCustomer: async (req, res, next) => {
      try {
        const data = await creditService.getPendingByCustomer(String(req.params.customerId), req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = creditControllerFactory;
