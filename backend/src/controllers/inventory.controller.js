function inventoryControllerFactory(stockService) {
  return {
    stockStatus: async (req, res, next) => {
      try {
        const data = await stockService.getStockStatus(req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = inventoryControllerFactory;
