let stackVar;
export const asyncHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((err) => {
      if (err.code == 11000) {
        stackVar = err.stack;
        return res.status(409).json({
          message: "email already exist",
          error: err.message,
          stack: err.stack,
        });
      }
      stackVar = err.stack;

      next(new Error(err.message, { cause: 400, stack: err.stack }));
    });
  };
};

export { stackVar };
