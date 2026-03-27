function resourceControllerFactory(service) {
  return {
    list: async (req, res, next) => {
      try {
        const data = await service.list(req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    getById: async (req, res, next) => {
      try {
        const data = await service.getById(String(req.params.id), req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    create: async (req, res, next) => {
      try {
        const data = await service.create(req.body, req.user.shopId);
        res.status(201).json({ data });
      } catch (error) {
        next(error);
      }
    },
    update: async (req, res, next) => {
      try {
        const data = await service.update(String(req.params.id), req.body, req.user.shopId);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    },
    remove: async (req, res, next) => {
      try {
        await service.remove(String(req.params.id), req.user.shopId);
        res.json({ message: 'Deleted' });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = resourceControllerFactory;
