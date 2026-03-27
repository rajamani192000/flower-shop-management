function uploadControllerFactory(uploadService) {
  return {
    uploadPurchaseBill: async (req, res, next) => {
      try {
        const shopId = req.user?.shopId || req.body.shopId;
        const data = await uploadService.uploadPurchaseBill({
          file: req.file,
          shopId
        });
        res.status(201).json({ data });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = uploadControllerFactory;
