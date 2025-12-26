import {BaseError} from './base.error';
import HttpStatus from 'http-status-codes';
import {ExternalErrorDTO} from '../model';

/**
 * Error coming from the external platform's API.
 */
export class PlatformError extends BaseError {
  private static readonly status = HttpStatus.SERVICE_UNAVAILABLE;

  /**
   * Constructor.
   *
   * @param message
   * @param httpCode
   * @param errorCode
   * @param externalErrors
   */
  constructor(
    message?: string,
    httpCode?: number,
    readonly errorCode?: number,
    externalErrors?: ExternalErrorDTO[]
  ) {
    super(
      HttpStatus.getStatusText(httpCode || PlatformError.status),
      'External platform error',
      message,
      httpCode || PlatformError.status,
      externalErrors
    );
  }
}
