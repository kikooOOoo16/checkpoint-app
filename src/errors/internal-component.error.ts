import {BaseError} from './base.error';
import HttpStatus from 'http-status-codes';

/**
 * Error thrown when some internal system component malfunctions.
 */
export class InternalComponentError extends BaseError {
  private static readonly status = HttpStatus.INTERNAL_SERVER_ERROR;
  /**
   * Constructor.
   *
   * @param message - error message
   */
  constructor(message?: string) {
    super(
      HttpStatus.getStatusText(InternalComponentError.status),
      'Internal Component Error',
      message,
      InternalComponentError.status
    );
  }
}
