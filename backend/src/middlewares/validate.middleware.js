function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const error = new Error('Validation failed');
      error.status = 400;
      error.publicMessage = 'Please correct highlighted fields';
      error.details = result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
      error.message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ') || 'Validation failed';
      next(error);
      return;
    }
    req[source] = result.data;
    next();
  };
}

module.exports = validate;
