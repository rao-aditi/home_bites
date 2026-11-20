// Validates req[source] against a zod schema and replaces it with the parsed
// (and coerced/defaulted) value. Throws ZodError on failure, which errorHandler
// turns into a clean 400 { message } response.
function validate(schema, source = "body") {
  return function (req, res, next) {
    req[source] = schema.parse(req[source]);
    next();
  };
}

module.exports = validate;
