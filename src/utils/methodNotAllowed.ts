import { NextFunction, Request, Response } from 'express';

import { HTTPMethod } from './consts';

/**
 * Middleware factory that creates a handler to restrict HTTP methods to only those allowed.
 * Returns a 405 Method Not Allowed response for requests using disallowed methods.
 *
 * @param allowedMethods - Array of HTTP methods that are permitted for the route
 * @returns Express middleware function that validates the request method
 *
 * @example
 * ```typescript
 * router.use('/api/users', methodNotAllowed(['GET', 'POST']));
 * ```
 */
export const methodNotAllowed =
  (allowedMethods: HTTPMethod[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!allowedMethods.includes(req.method as HTTPMethod)) {
      res.setHeader('Allow', allowedMethods.join(', '));
      res.status(405).json({ status: 'fail', message: 'Method not allowed' });
      return;
    }
    next();
  };
