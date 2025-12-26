import {ExternalErrorDTO} from '../model';

/**
 * Base class for any error thrown in CMO.
 */
export class BaseError extends Error {
  externalErrors: ExternalErrorDTO[];
  /**
   * Constructor.
   *
   * @param type
   * @param title - short description of the error
   * @param message - error message
   * @param httpCode - http code of error
   * @param externalErrors
   * @protected
   */
  protected constructor(
    readonly type?: string,
    readonly title?: string,
    message?: string,
    readonly httpCode?: number,
    externalErrors?: ExternalErrorDTO[]
  ) {
    super(message);
    this.externalErrors = externalErrors;
  }
}
