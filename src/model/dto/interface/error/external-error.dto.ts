/**
 * A Data Transfer Object (DTO) representing an external error.
 * Contains information about an error that occurred on an external platform.
 *
 * @interface
 */
export interface ExternalErrorDTO {
  /**
   * The name of the external platform where the error occurred.
   *
   * @type {string}
   */
  system: string;

  /**
   * The HTTP response code received from the external platform.
   *
   * @type {number}
   */
  status: number;

  /**
   * The native error code of the external platform (if present).
   *
   * @type {string|undefined}
   */
  errorCode?: string;

  /**
   * The error message text (if present).
   *
   * @type {string|undefined}
   */
  errorMessage?: string;
}
