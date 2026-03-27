const { auth, db } = require('../config/firebase');

async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';

    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = await auth.verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decoded.uid).get();

    if (!userDoc.exists) {
      res.status(401).json({ message: 'User profile not found' });
      return;
    }

    req.user = userDoc.data();
    req.uid = decoded.uid;

    next();
  } catch (error) {
    res.status(401).json({ message: error.message || 'Unauthorized' });
  }
}

module.exports = authMiddleware;
