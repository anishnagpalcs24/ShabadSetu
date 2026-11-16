export const sendSuccess = (res, { statusCode = 200, message = "Request successful", data = {} } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res, { statusCode = 500, message = "An error occurred", errors = [] } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors]
  });
};

export default {
  sendSuccess,
  sendError
};
