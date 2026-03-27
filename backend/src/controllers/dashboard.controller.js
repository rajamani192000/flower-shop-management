function dashboardControllerFactory(dashboardService) {
  return {
    getOverview: async (req, res, next) => {
      try {
        const data = await dashboardService.getOverview(req.user.shopId, req.query);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    globalSearch: async (req, res, next) => {
      try {
        const data = await dashboardService.globalSearch(req.user.shopId, req.query.query);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = dashboardControllerFactory;
