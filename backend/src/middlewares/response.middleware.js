function inferMessage(method) {
  if (method === 'POST') {
    return 'Saved successfully';
  }
  if (method === 'PUT' || method === 'PATCH') {
    return 'Updated successfully';
  }
  if (method === 'DELETE') {
    return 'Deleted successfully';
  }
  return 'Success';
}

function responseMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);

  res.success = (data, message = inferMessage(req.method), status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  };

  res.json = (payload) => {
    if (payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'success')) {
      return originalJson(payload);
    }

    const data = payload && typeof payload === 'object' && Object.prototype.hasOwnProperty.call(payload, 'data')
      ? payload.data
      : payload;

    const message = payload && typeof payload === 'object' && typeof payload.message === 'string'
      ? payload.message
      : inferMessage(req.method);

    return originalJson({
      success: true,
      message,
      data
    });
  };

  next();
}

module.exports = responseMiddleware;

