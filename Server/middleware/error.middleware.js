module.exports.errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }
  res.status(err.statusCode || 500).json({
    message: err.message || "Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
