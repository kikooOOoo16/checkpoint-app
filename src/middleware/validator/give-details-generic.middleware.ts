import {NextFunction, Request, Response} from 'express';
import {IllegalRequestSchemaError} from '../../errors';
import {JsonSchemaValidator} from '../../util';

/**
 * Give details payload validation
 */
export class GiveDetailsGenericValidator {
  private static readonly validator = JsonSchemaValidator.getInstance();
  private static readonly SCHEMA_NAME = 'GiveDetailsGenericSchema';

  /**
   * Validates request body.
   */
  static validate(request: Request, response: Response, next: NextFunction): void {
    let nextValue: undefined | IllegalRequestSchemaError;
    try {
      GiveDetailsGenericValidator.validator.validate(request.body, GiveDetailsGenericValidator.SCHEMA_NAME);
    } catch (error: any) {
      nextValue = new IllegalRequestSchemaError(error.message);
    } finally {
      next(nextValue);
    }
  }
}
