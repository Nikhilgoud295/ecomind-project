const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const dataToValidate = source === 'params' ? req.params : source === 'query' ? req.query : req.body;
    const parsed = schema.parse(dataToValidate);
    
    if (source === 'body') req.body = parsed;
    else if (source === 'query') req.query = parsed;
    else if (source === 'params') req.params = parsed;
    
    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }
    return res.status(400).json({ success: false, message: 'Invalid request data' });
  }
};

module.exports = validate;
