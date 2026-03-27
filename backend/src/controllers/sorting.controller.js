function sortingControllerFactory(resourceController, sortingService) {
  return {
    list: resourceController.list,
    getById: resourceController.getById,
    create: async (req, res, next) => {
      try {
        const data = await sortingService.create(req.body, req.user.shopId);
        res.status(201).json({ data });
      } catch (error) {
        next(error);
      }
    },
    update: async (req, res, next) => {
      try {
        const data = await sortingService.update(String(req.params.id), req.body, req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    remove: resourceController.remove
  };
}

module.exports = sortingControllerFactory;
