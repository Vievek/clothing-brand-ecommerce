import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';

const UNAUTHORIZED_STATUS = 401;

export const auth = asyncHandler(async (req, _res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const authHeader = req.headers.authorization;
    [, token] = authHeader.split(' ');
  }

  if (!token) {
    return next(
      new AppError('Please login to access this resource', UNAUTHORIZED_STATUS)
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User no longer exists', UNAUTHORIZED_STATUS));
    }

    // Attach user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return next();
  } catch (_error) {
    return next(new AppError('Invalid token', UNAUTHORIZED_STATUS));
  }
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const authHeader = req.headers.authorization;
    [, token] = authHeader.split(' ');
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (user) {
        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      }
    } catch (_error) {
      // Continue without user for optional auth
    }
  }

  return next();
});
