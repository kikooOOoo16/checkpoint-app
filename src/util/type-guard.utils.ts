import {PlatformErrorDataResponse} from '../model';

/**
 * Namespace for type guard util functions
 */
export namespace TypeGuardUtils {
  /**
   * Helper function that checks if an object is an instance of PlatformErrorDataResponse.
   *
   * @param {*} obj - The object to check.
   * @returns {boolean} - `true` if the object is an instance of PlatformErrorDataResponse, `false` otherwise.
   * TODO update to match error structure received from external platform
   */
  export function isAPlatformErrorDataResponse(obj: any): obj is PlatformErrorDataResponse {
    return typeof obj === 'object' && 'errorMessage' in obj && 'errorCode' in obj && 'status' in obj;
  }
}
