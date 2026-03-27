const { onRequest } = require('firebase-functions/v2/https');
const app = require('./app');

exports.api = onRequest(
  {
    region: process.env.FUNCTION_REGION || 'us-central1',
    memory: '512MiB',
    timeoutSeconds: 60
  },
  app
);

