import {BaseError} from './base.error';
import HttpStatus from 'http-status-codes';

/**
 * Error which is thrown when credentials provided by secret storage are invalid.
 */
export class CredentialsConfigurationError extends BaseError {
  private static readonly status = HttpStatus.INTERNAL_SERVER_ERROR;
  /**
   * Constructor.
   *
   * @param message - error message
   */
  constructor(message?: string) {
    super(
      HttpStatus.getStatusText(CredentialsConfigurationError.status),
      'Configuration error',
      message,
      CredentialsConfigurationError.status
    );
  }
}
