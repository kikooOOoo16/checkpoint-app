import {BaseError} from './base.error';
import HttpStatus from 'http-status-codes';

/**
 * Error covering not implemented API functionality.
 */
export class NotImplementedError extends BaseError {
  private static readonly status = HttpStatus.NOT_IMPLEMENTED;

  /**
   * Constructor.
   *
   * @param {string} message - error message (optional)
   */
  constructor(message?: string) {
    super(
      HttpStatus.getStatusText(NotImplementedError.status),
      'Error',
      message || 'Functionality not implemented',
      NotImplementedError.status,
      []
    );
  }
}
