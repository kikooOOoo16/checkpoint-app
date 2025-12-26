import {BaseInternalError} from './base-internal.error';
import HttpStatus from 'http-status-codes';

/**
 * Error when something goes wrong internally.
 */
export class InternalError extends BaseInternalError {
  /**
   * Constructor.
   *
   * @param message - error message
   */
  constructor(message?: string) {
    super(
      HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR),
      'Internal Error',
      message,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
