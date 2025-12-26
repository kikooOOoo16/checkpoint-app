import {CheckpointGenericRequest} from './interface';

/**
 * Represents an adapter request with pagination options.
 *
 * @interface
 * @extends {CheckpointGenericRequest}
 */
export interface CheckpointPaginationRequest extends CheckpointGenericRequest {
  /**
   * The number of items per page.
   *
   * @type {number}
   */
  pageSize: number;

  /**
   * The current page number.
   *
   * @type {number}
   */
  pageNumber: number;

  /**
   * A boolean flag indicating if the maximum number of items should be returned.
   *
   * @type {boolean}
   */
  maxSize?: boolean;
}
