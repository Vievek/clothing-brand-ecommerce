import AppError from '../utils/appError.js';

const UNAUTHORIZED_STATUS = 401;
const BAD_REQUEST_STATUS = 400;
const INTERNAL_SERVER_ERROR_STATUS = 500;

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', UNAUTHORIZED_STATUS);

const handleJWTExpiredError = () =>
  new AppError(
    'Your token has expired! Please log in again.',
    UNAUTHORIZED_STATUS,
  );

const handleZodError = (error) => {
  let issues = [];

  try {
    // Parse the JSON string from error.message
    issues = JSON.parse(error.message);
  } catch {
    // If parsing fails, use empty array
    issues = [];
  }

  // Ensure it's an array and extract messages
  const message = Array.isArray(issues)
    ? issues
        .map((issue) => issue.message)
        .filter(Boolean) // Remove empty messages
        .join('. ')
    : error.message || 'Validation failed';

  return new AppError(message, BAD_REQUEST_STATUS);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(INTERNAL_SERVER_ERROR_STATUS).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

export default (err, _req, res, _next) => {
  err.statusCode = err.statusCode || INTERNAL_SERVER_ERROR_STATUS;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    if (error.name === 'ZodError') {
      error = handleZodError(error);
    }

    sendErrorProd(error, res);
  }
};
