const express = require('express');

function authRoutes(controller, authMiddleware, validate, schemas) {
  const router = express.Router();

  router.post('/register', validate(schemas.registerSchema), controller.register);
  router.post('/login', validate(schemas.loginSchema), controller.login);
  router.get('/profile', authMiddleware, controller.profile);
  router.put('/profile', authMiddleware, controller.updateProfile);

  return router;
}

module.exports = authRoutes;
