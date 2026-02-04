import { NextFunction, Request as RequestExpress, Response } from 'express';

import { UserType } from '../models/userTypes';
import catchAsync from '../utils/catchAsync';

export type RequestRainlog = RequestExpress & {
  user?: UserType;
};

// Middleware to allow only logged in users to access certain routes
export const protect = catchAsync(
  async (req: RequestRainlog, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    // The token is sent only in the Authorization header
    let token: string | undefined;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    // 2. Verify token
    const authRes = await fetch(`${process.env.AUTH_URL}/users/isloggedin`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(30000) // 30 seconds timeout
    });

    if (authRes.status === 401) {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not logged in! Please log in to get access.'
      });
    } else if (authRes.status !== 200) {
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong. Please try again later.'
      });
    }

    // Parse the response body
    const authData = await authRes.json();

    // 3. Grant access and save user info
    req.user = authData.data.user as UserType;

    next();
  }
);
