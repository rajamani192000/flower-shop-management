const express = require('express');

function commonRoutes(controller, authMiddleware) {
  const router = express.Router();

  router.use(authMiddleware);
  router.post('/create', controller.create);
  router.get('/list', controller.list);
  router.put('/update', controller.update);
  router.delete('/delete', controller.remove);

  return router;
}

module.exports = commonRoutes;
