import {Request, Response} from 'express';
import {ExpressMiddlewareInterface} from 'routing-controllers';
import {commonService as commonServiceInstance} from '../service';
import {getTraceId, logger, LogNamespace} from '../logger';
import {httpRequestContext} from '../http-request-context';

/**
 * Enriches http request context with information for interaction with SEED.
 */
export class AdapterContextMiddleware implements ExpressMiddlewareInterface {
  /**
   * Creates an instance of AdapterContextMiddleware.
   *
   * @param {CommonService} [commonService=commonServiceInstance] - The common service instance.
   */
  constructor(private readonly commonService = commonServiceInstance) {}

  /**
   * Middleware.
   *
   * @param request
   * @param response
   * @param next
   */
  // eslint-disable-next-line @typescript-eslint/require-await
  async use(request: Request, response: Response, next: (err?: any) => any): Promise<void> {
    httpRequestContext.setTraceId(request.body?.traceId);
    logger(LogNamespace.ADAPTER_CONTEXT_MIDDLEWARE_NAMESPACE).debug('Adapter context middleware reached', {
      context: {
        traceId: getTraceId()
      }
    });
    try {
      next();
    } catch (err) {
      logger(LogNamespace.ADAPTER_CONTEXT_MIDDLEWARE_NAMESPACE).error(
        'Problem setting external platform request context',
        {
          context: {
            traceId: getTraceId(),
            stackTrace: err.stack
          }
        }
      );
      next(err);
    }
  }
}
