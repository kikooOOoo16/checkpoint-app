import {NextFunction, Request, Response} from 'express';

/**
 * Middleware to prevent logged-in users from accessing login/registration pages.
 */
export const redirectIfLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const session = (req as any).session;
  if (session && session.user) {
    session.error = 'You are already logged in. Please logout first to access this page.';
    return res.redirect('/dashboard');
  }
  next();
};
