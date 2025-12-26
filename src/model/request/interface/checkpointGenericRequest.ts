import {ConnectionDetails} from '../../connection-details';

/**
 * Interface describing a TMSP Adapter Request.
 *
 * @interface
 */
export interface CheckpointGenericRequest {
  /**
   * Credentials required to establish a connection.
   *
   * @type {ConnectionDetails}
   */
  credentials: ConnectionDetails;

  /**
   * A unique identifier that can be used to trace a request/response cycle.
   *
   * @type {string}
   */
  traceId: string;
}
