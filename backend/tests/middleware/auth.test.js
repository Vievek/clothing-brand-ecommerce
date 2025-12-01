import jwt from 'jsonwebtoken';
import { auth, optionalAuth } from '../../src/middleware/auth.js';
import User from '../../src/models/User.js';

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFn;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {};
    nextFn = jest.fn();
  });

  test('should call next with error if no token provided', async () => {
    await auth(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        message: 'Please login to access this resource',
      })
    );
  });

  test('should call next with error for invalid token', async () => {
    mockReq.headers.authorization = 'Bearer invalid-token';

    await auth(mockReq, mockRes, nextFn);

    expect(nextFn).toHaveBeenCalledWith(expect.any(Error));
  });
});
