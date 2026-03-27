const express = require('express');
const multer = require('multer');

function uploadRoutes(controller, authMiddleware) {
  const router = express.Router();
  const upload = multer({ storage: multer.memoryStorage() });

  router.use(authMiddleware);
  router.post('/', upload.single('file'), controller.uploadPurchaseBill);

  return router;
}

module.exports = uploadRoutes;
