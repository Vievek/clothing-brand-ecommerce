import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

const UNAUTHORIZED_STATUS = 401;

export const auth = asyncHandler(async (req, _res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    const [, extractedToken] = req.headers.authorization.split(" ");
    token = extractedToken;
  }

  if (!token) {
    return next(
      new AppError("Please login to access this resource", UNAUTHORIZED_STATUS)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("User no longer exists", UNAUTHORIZED_STATUS));
    }

    req.user = user;
    return next();
  } catch (_error) {
    return next(new AppError("Invalid token", UNAUTHORIZED_STATUS));
  }
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    const [, extractedToken] = req.headers.authorization.split(" ");
    token = extractedToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      req.user = user;
    } catch (_error) {
      // Continue without user for optional auth
    }
  }

  return next();
});
