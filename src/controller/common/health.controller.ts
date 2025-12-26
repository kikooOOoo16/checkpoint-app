import {Get, JsonController} from 'routing-controllers';
import {getTraceId, logger, LogNamespace} from '../../logger';
import {AdapterHealthDTO} from '../../model/dto/adapter-health.dto';
import {Constants} from '../../service/const';

/**
 * Controller for exposing the health check endpoint.
 */
@JsonController()
export class HealthController {
  /**
   * Returns the health status of the service.
   *
   * @route GET /seed-adapter-health
   * @returns The HTTP response with status code 200 (OK) and system name.
   */
  @Get(`/${Constants.EXTERNAL_SYSTEM_NAME}-api-health`)
  public getHealthState(): AdapterHealthDTO {
    logger(LogNamespace.HEALTH_NAMESPACE).info('Health seed adapter endpoint requested', {
      context: {
        traceId: getTraceId()
      }
    });

    return {
      system: Constants.EXTERNAL_SYSTEM_NAME
    } as AdapterHealthDTO;
  }
}
