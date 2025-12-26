import {logger, LogNamespace} from '../logger';
import {NextFunction, Request, Response} from 'express';

/**
 * Middleware function to log the request body.
 *
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The Express NextFunction to continue processing the request.
 */
export const logRequestBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    logger(LogNamespace.REQUEST_LOGGER_NAMESPACE).debug(`Raw body`, {
      context: {
        traceId: req.body?.traceId || req.body?.uuid,
        attributes: {body: req.body}
      }
    });
  }
  next();
};
