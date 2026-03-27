function adminControllerFactory(seederService) {
  return {
    initializeDatabase: async (req, res, next) => {
      try {
        const shopId = req.body.shopId || req.user.shopId;
        await seederService.initializeShop(shopId);
        res.json({ message: 'Database initialized successfully' });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = adminControllerFactory;
