import {apiAdapter} from './api/api.adapter';
import {CheckpointGenericRequest} from '../model';

/**
 * A class that provides common functionality shared across multiple services.
 */
export class CommonService {
  /**
   * Constructs a new CommonService instance with the given adapter.
   *
   * @constructor
   * @param {apiAdapter} adapter - The adapter used for communication with the platform.
   */
  constructor(private readonly adapter = apiAdapter) {}

  /**
   * Function to retrieve the platform status.
   *
   * @param {CheckpointGenericRequest} body - An object containing details for the platform connection.
   * @returns {Promise<any>} A promise containing the response object from the platform.
   */
  async getPlatformStatus(body: CheckpointGenericRequest): Promise<any> {
    return {} as Promise<any>;
  }
}

/**
 * An instance of the CommonService class with the default apiAdapter.
 */
export const commonService = new CommonService();
