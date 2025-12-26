/**
 * Object containing connection details for a service.
 *
 * @interface ConnectionDetails
 */
export interface ConnectionDetails {
  /**
   * URL for the service.
   *
   * @type {string}
   */
  url: string;

  /**
   * Username for the connection.
   *
   * @type {string}
   */
  username: string;

  /**
   * API key for the connection.
   *
   * @type {string}
   */
  password: string;

  /**
   * Account name for the connection.
   *
   * @type {string}
   */
  email: string;
}
