function authControllerFactory(authService) {
  return {
    register: async (req, res, next) => {
      try {
        const result = await authService.register(req.body);
        res.status(201).json({
          message: 'Shop registered successfully. Please login.',
          data: result
        });
      } catch (error) {
        next(error);
      }
    },

    login: async (req, res, next) => {
      try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json({
          message: 'Welcome back!',
          data: result
        });
      } catch (error) {
        next(error);
      }
    },

    profile: async (req, res, next) => {
      try {
        const profile = await authService.profile(req.uid);
        res.json({ data: profile });
      } catch (error) {
        next(error);
      }
    },

    updateProfile: async (req, res, next) => {
      try {
        const data = await authService.updateProfile(req.uid, req.body);
        res.json({ message: 'Profile updated successfully', data });
      } catch (error) {
        next(error);
      }
    }
  };
}

module.exports = authControllerFactory;
