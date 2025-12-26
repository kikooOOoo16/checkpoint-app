import {axiosClient, HttpRequestBuilder} from '../../http-client';
import {ConnectionDetails} from '../../model';
import {getTraceId, logger, LogNamespace} from '../../logger';
import {HttpUtils} from '../../util';
import {String} from 'typescript-string-operations';

export * from './api.adapter';

/**
 * The adapter to provide data from the external platform's API.
 */
export class ApiAdapter {
  private static CONTENT_TYPE = 'Content-Type';
  private static CONTENT_TYPE_JSON = 'application/json';

  private static readonly GET_DETAILS_ENDPOINT = 'endpoint/data/details/{0}';

  /**
   * Constructor.
   */
  constructor(private readonly httpClient = axiosClient) {}

  /**
   * Retrieves details for a specific SIM card based on the provided ICCID.
   *
   * @async
   * @param {ConnectionDetails} connectionDetails - Details needed for establishing the connection.
   * @param {string} iccid - The ICCID (Integrated Circuit Card Identifier) of the SIM card.
   * @returns {Promise<any | PlatformErrorDataResponse>} A promise resolving to SIM card details or an error response.
   * @throws {PlatformError} Throws an error if there is an issue during the retrieval process.
   */
  async getDataFromExternalPlatform(connectionDetails: ConnectionDetails, iccid: string | string[]): Promise<any> {
    logger(LogNamespace.API_ADAPTER_REQUEST_NAMESPACE).info('Attempt to get sim card details from AIRLINQ', {
      context: {
        traceId: getTraceId(),
        attributes: {iccid}
      }
    });

    const path = String.format(`${ApiAdapter.GET_DETAILS_ENDPOINT}`, iccid);
    const getSimDetailsEndpoint = `${HttpUtils.normalizeUrl('url')}${path}`;

    const httpRequest = new HttpRequestBuilder()
      .setUrl(getSimDetailsEndpoint)
      .setBearerAuthorization('token if needed')
      .addHeader(ApiAdapter.CONTENT_TYPE, ApiAdapter.CONTENT_TYPE_JSON)
      .build();

    try {
      return await this.httpClient.post<void, any>(httpRequest);
    } catch (err: any) {
      logger(LogNamespace.API_ADAPTER_REQUEST_NAMESPACE).error('Problem retrieving data from external platform', {
        context: {
          traceId: getTraceId(),
          attributes: {iccid, error: err.message, stack: err.stack}
        }
      });
      throw err;
    }
  }
}

/**
 * An instance of the ApiAdapter class.
 */
export const apiAdapter = new ApiAdapter();
