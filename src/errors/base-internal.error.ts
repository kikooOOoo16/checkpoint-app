import {BaseError} from './base.error';

/**
 * Base class for internal errors thrown in CMO.
 */
export class BaseInternalError extends BaseError {
  /**
   * Constructor.
   *
   * @param type
   * @param title - short description of the error
   * @param message - error message
   * @param status - http code of error
   * @param isInternalError
   * @protected
   */
  protected constructor(
    readonly type?: string,
    readonly title?: string,
    message?: string,
    readonly status?: number,
    readonly isInternalError = true
  ) {
    super(type, title, message, status);
  }
}
