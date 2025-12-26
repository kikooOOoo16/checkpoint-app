import HttpStatus from 'http-status-codes';
import {BaseError} from './base.error';

/**
 * Error which is thrown when incorrect header is provided.
 */
export class IllegalHeaderError extends BaseError {
  private static readonly status = HttpStatus.BAD_REQUEST;
  /**
   * Constructor.
   *
   * @param message - error message
   */
  constructor(message?: string) {
    super(
      HttpStatus.getStatusText(IllegalHeaderError.status),
      'Missing or malformed header',
      message,
      IllegalHeaderError.status
    );
  }
}
