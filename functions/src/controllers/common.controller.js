function commonControllerFactory(commonService) {
  return {
    create: async (req, res, next) => {
      try {
        const { collection, data } = req.body;
        const record = await commonService.create(collection, data || {}, req.user.shopId);
        res.status(201).json({ data: record });
      } catch (error) {
        next(error);
      }
    },

    list: async (req, res, next) => {
      try {
        const collection = String(req.query.collection || '');
        const records = await commonService.list(collection, req.user.shopId);
        res.json({ data: records });
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        const { collection, id, data } = req.body;
        const record = await commonService.update(collection, id, data || {}, req.user.shopId);
        res.json({ data: record });
      } catch (error) {
        next(error);
      }
    },

    remove: async (req, res, next) => {
      try {
        const collection = String(req.query.collection || '');
        const id = String(req.query.id || '');
        await commonService.remove(collection, id, req.user.shopId);
        res.json({ message: 'Deleted' });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = commonControllerFactory;
