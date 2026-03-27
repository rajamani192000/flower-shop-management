const admin = require('firebase-admin');

if (!admin.apps.length) {
  const options = {};
  if (process.env.FIREBASE_STORAGE_BUCKET) {
    options.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  }
  admin.initializeApp(options);
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage().bucket();

module.exports = { admin, db, auth, storage };

