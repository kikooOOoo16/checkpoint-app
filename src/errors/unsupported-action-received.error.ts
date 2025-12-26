import HttpStatus from 'http-status-codes';
import {BaseError} from './base.error';

/**
 * Error which is thrown when unsupported action for product search is received.
 */
export class UnsupportedActionReceivedError extends BaseError {
  private static readonly status = HttpStatus.BAD_REQUEST;

  /**
   * Constructor.
   *
   * @param message - error message.
   */
  constructor(message: string) {
    super(
      HttpStatus.getStatusText(UnsupportedActionReceivedError.status),
      'Unsupported action received',
      message,
      UnsupportedActionReceivedError.status,
      []
    );
  }
}
