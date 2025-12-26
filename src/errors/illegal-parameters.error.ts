import {BaseError} from './base.error';
import HttpStatus from 'http-status-codes';

/**
 * Error which is thrown when incorrect input is provided.
 */
export class IllegalParametersError extends BaseError {
  private static readonly status = HttpStatus.BAD_REQUEST;

  /**
   * Constructor.
   *
   * @param message - error message
   */
  constructor(message?: string) {
    super(
      HttpStatus.getStatusText(IllegalParametersError.status),
      'Illegal parameters',
      message || 'Illegal parameters provided',
      IllegalParametersError.status,
      []
    );
  }
}
