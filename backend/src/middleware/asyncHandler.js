// Wraps an async controller so a rejected promise is forwarded to next(err)
// instead of crashing the process / hanging the request.
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
