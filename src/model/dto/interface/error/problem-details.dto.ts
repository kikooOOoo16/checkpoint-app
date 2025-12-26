import {ExternalErrorDTO} from './external-error.dto';

/**
 * A Data Transfer Object (DTO) representing problem details.
 * Contains information about an error that occurred during processing a request.
 *
 * @interface
 */
export interface ProblemDetailsDTO {
  /**
   * The HTTP status message.
   *
   * @type {string}
   */
  type: string;

  /**
   * The HTTP response code.
   *
   * @type {number}
   */
  status: number;

  /**
   * A brief, human-readable message about the error.
   *
   * @type {string}
   */
  title: string;

  /**
   * A human-readable explanation of the error.
   *
   * @type {string}
   */
  detail: string;

  /**
   * Optional: A list of errors from external platforms (if any).
   *
   * @type {ExternalErrorDTO[]|undefined}
   */
  externalErrors: ExternalErrorDTO[];
}
