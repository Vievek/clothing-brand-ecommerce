import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  // Use environment variable with fallback for testing
  const secret = process.env.JWT_SECRET || 'test-secret-key-for-jwt-tokens';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn: expiresIn,
  });
};

export default generateToken;
