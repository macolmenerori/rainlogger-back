/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';

/**
 * Wrapper function for async route handlers that catches promise rejections
 * and handles errors automatically. Returns a 500 Internal Server Error response
 * when an unhandled error occurs.
 *
 * @param fn - Async Express route handler function to wrap
 * @returns Express middleware function that handles promise rejections
 *
 * @example
 * ```typescript
 * router.get('/users', catchAsync(async (req, res, next) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 * ```
 */
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((e) => {
      // In Express v5, we can rely on automatic promise rejection handling
      // but we'll keep this for explicit error handling and logging
      console.error('Async error caught:', e);
      return res.status(500).json({
        status: 'fail',
        message: 'Internal server error'
      });
    });
  };

export default catchAsync;
