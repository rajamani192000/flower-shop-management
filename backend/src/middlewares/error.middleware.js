function errorMiddleware(error, req, res, next) {
  console.error('[API ERROR]', error);
  const status = error.status || 500;
  const message = error.publicMessage || error.message || 'Operation failed';
  res.status(status).json({
    success: false,
    message,
    error: error.message || 'Internal server error',
    details: error.details || undefined
  });
}

module.exports = errorMiddleware;
