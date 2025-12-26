import HttpStatus from 'http-status-codes';
import {BaseInternalError} from './base-internal.error';

/**
 * Error coming from input validation middleware.
 */
export class ValidationError extends BaseInternalError {
  /**
   * Constructor.
   *
   * @param message
   * @param status
   * @param errorCode
   */
  constructor(
    message?: string,
    status?: number,
    readonly errorCode?: number
  ) {
    super(
      HttpStatus.getStatusText(HttpStatus.BAD_REQUEST),
      'Validation error',
      message,
      status ? status : HttpStatus.BAD_REQUEST
    );
  }
}
