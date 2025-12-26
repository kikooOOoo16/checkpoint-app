import {ExpressErrorMiddlewareInterface, Middleware} from 'routing-controllers';
import {BaseError, PlatformError} from '../errors';
import {getTraceId, logger} from '../logger';
import {Request, Response} from 'express';
import HttpStatus from 'http-status-codes';
import {Constants} from '../service/const';
import {ExternalErrorDTO, ProblemDetailsDTO} from '../model';
import EXTERNAL_SYSTEM_NAME = Constants.EXTERNAL_SYSTEM_NAME;

/**
 * Global error handling middleware which represents errors in a unified form.
 */
@Middleware({type: 'after'})
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  private static readonly DEFAULT_ERROR_TITLE = 'Error';
  private static readonly APPLICATION_PROBLEM_JSON = 'application/problem+json';

  error(error: any, request: Request, response: Response, next: (err?: any) => any): void {
    logger().error(error.message, {
      context: {
        traceId: getTraceId(),
        stackTrace: error.stack
      }
    });

    const errorDTO = ErrorHandlerMiddleware.convertError(error);
    response.status(errorDTO.status).contentType(ErrorHandlerMiddleware.APPLICATION_PROBLEM_JSON).json(errorDTO);
    next(error);
  }

  /**
   * Converts a given error into a Problem Details DTO.
   *
   * @param {E} error - The error to be converted.
   * @returns {ProblemDetailsDTO} - The converted Problem Details DTO.
   */
  public static convertError<E extends BaseError>(error: E): ProblemDetailsDTO {
    const status = error.httpCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const title = error.title || ErrorHandlerMiddleware.DEFAULT_ERROR_TITLE;
    const externalErrors =
      error instanceof PlatformError
        ? [this.convertExternalError(error)]
        : error.externalErrors
        ? error.externalErrors
        : [];

    return {
      type: HttpStatus.getStatusText(status),
      status,
      title,
      detail: error.message,
      externalErrors
    };
  }

  /**
   * Converts a given externalError into an External Error DTO.
   *
   * @param {E} error - The error to be converted.
   * @returns {ExternalErrorDTO} - The converted External Error DTO.
   */
  private static convertExternalError<E extends PlatformError>(error: E): ExternalErrorDTO {
    return {
      status: error.httpCode,
      system: EXTERNAL_SYSTEM_NAME,
      errorMessage: error.message,
      errorCode: ErrorHandlerMiddleware.getExternalErrorCode(error) || ''
    };
  }

  /**
   * Gets the external error code of a PlatformError.
   *
   * @returns {string | undefined}
   */
  private static getExternalErrorCode<E extends PlatformError>(error: E): string | undefined {
    return error.errorCode ? String(error.errorCode) : undefined;
  }
}
