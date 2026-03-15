function successResponse(res, message, data = null, statusCode = 200) {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
}

function errorResponse(res, message, statusCode = 400) {
  return res.status(statusCode).json({
    status: "error",
    message,
    statusCode,
  });
}

module.exports = {
  successResponse,
  errorResponse,
};
