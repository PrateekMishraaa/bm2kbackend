export default function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "test") {
    console.error(`[ERROR] ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    error: statusCode >= 500 ? "Server Error" : "Request Error",
    message,
    ...(err.errors && { details: err.errors }),
  });
}
