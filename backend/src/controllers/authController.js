import User from '../models/User.js';
import AppError from '../utils/appError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import {
  userRegistrationSchema,
  userLoginSchema,
  googleAuthSchema,
} from '../validations/userValidation.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const BAD_REQUEST_STATUS = 400;
const UNAUTHORIZED_STATUS = 401;
const CREATED_STATUS = 201;
const OK_STATUS = 200;
const PASSWORD_LENGTH = 16;
const RANDOM_BASE = 36;

// Helper function to create response
const createAuthResponse = (user, token) => ({
  status: 'success',
  data: {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  },
});

// Helper function to generate random password
const generateRandomPassword = () =>
  Math.random().toString(RANDOM_BASE).slice(-PASSWORD_LENGTH);

// Helper function to find or create Google user
const findOrCreateGoogleUser = async (name, email, googleId) => {
  let user = await User.findOne({
    $or: [{ email }, { googleId }],
  });

  if (!user) {
    user = await User.create({
      name,
      email,
      googleId,
      password: generateRandomPassword(),
    });
  }

  return user;
};

export const register = asyncHandler(async (req, res, next) => {
  // Validate input data
  const validatedData = userRegistrationSchema.parse(req.body);

  // Check if user already exists
  const existingUser = await User.findOne({ email: validatedData.email });
  if (existingUser) {
    return next(
      new AppError('User already exists with this email', BAD_REQUEST_STATUS),
    );
  }

  // Create user
  const user = await User.create(validatedData);

  // Generate token
  const token = generateToken(user.id);

  return res.status(CREATED_STATUS).json(createAuthResponse(user, token));
});

export const login = asyncHandler(async (req, res, next) => {
  // Validate input data
  const validatedData = userLoginSchema.parse(req.body);

  // Find user and include password
  const user = await User.findOne({ email: validatedData.email }).select(
    '+password',
  );

  // Check if user exists and password is correct
  if (!user || !(await user.correctPassword(validatedData.password))) {
    return next(
      new AppError('Incorrect email or password', UNAUTHORIZED_STATUS),
    );
  }

  // Generate token
  const token = generateToken(user.id);

  return res.status(OK_STATUS).json(createAuthResponse(user, token));
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { token: googleToken } = googleAuthSchema.parse(req.body);

  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, sub: googleId } = ticket.getPayload();
  const user = await findOrCreateGoogleUser(name, email, googleId);
  const authToken = generateToken(user.id);

  return res.status(OK_STATUS).json(createAuthResponse(user, authToken));
});

export const getMe = asyncHandler(async (req, res) => res.status(OK_STATUS).json({
    status: 'success',
    data: {
      user: req.user,
    },
  }));
