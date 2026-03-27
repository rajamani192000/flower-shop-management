function mastersControllerFactory(commonService) {
  return {
    listFlowers: async (req, res, next) => {
      try {
        const data = await commonService.list('flowers', req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    listCustomers: async (req, res, next) => {
      try {
        const data = await commonService.list('customers', req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    listSuppliers: async (req, res, next) => {
      try {
        const data = await commonService.list('suppliers', req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = mastersControllerFactory;
