import {BaseError} from './base.error';
import HttpStatus from 'http-status-codes';

/**
 * Error when Patch Request Body is wrong.
 */
export class IllegalRequestSchemaError extends BaseError {
  private static readonly status = HttpStatus.BAD_REQUEST;
  /**
   * Constructor.
   *
   * @param message - error message
   */
  constructor(message?: string) {
    super(
      HttpStatus.getStatusText(IllegalRequestSchemaError.status),
      'Invalid payload',
      message,
      IllegalRequestSchemaError.status
    );
  }
}
