import Ajv from 'ajv';
import AjvErrors, {ErrorMessageOptions} from 'ajv-errors';
import {CurrentOptions} from 'ajv/dist/core';
import {AnyValidateFunction} from 'ajv/dist/types';
import {InternalError, ValidationError} from '../errors';
import {SCHEMAS} from '../model/validation_schema';

/**
 * JSON Schema Validator
 */
export class JsonSchemaValidator {
  private static instance: JsonSchemaValidator;
  private static readonly DEFAULT_SETTINGS: CurrentOptions = {
    allErrors: true,
    verbose: true,
    discriminator: true
  };
  private static readonly DEFAULT_ERROR_SETTINGS: ErrorMessageOptions = {singleError: false, keepErrors: false};
  private static readonly COMMAND_ERROR_MESSAGE = "Command '{0:s}' not applicable to path '{1:s}'";
  private readonly validator;

  /**
   * Constructor.
   *
   * @param schemas - JSON Schema definition
   * @param ajvSettings - AJV validator Settings
   * @param ajvErrorSettings - AJVErrors Settings
   */
  constructor(
    schemas: Record<string, unknown>[],
    ajvSettings = JsonSchemaValidator.DEFAULT_SETTINGS,
    ajvErrorSettings = JsonSchemaValidator.DEFAULT_ERROR_SETTINGS
  ) {
    this.validator = new Ajv(ajvSettings);
    this.validator.addSchema(schemas);
    AjvErrors(this.validator, ajvErrorSettings);
  }

  public static getInstance(): JsonSchemaValidator {
    if (!JsonSchemaValidator.instance) {
      JsonSchemaValidator.instance = new JsonSchemaValidator(SCHEMAS);
    }
    return JsonSchemaValidator.instance;
  }

  /**
   * Validates given Object against provided Schema
   *
   * @param object - Object to validate
   * @param schemaName - Validation Schema name
   */
  validate<T>(object: T, schemaName: string): void {
    const schemaValidator = this.validator.getSchema(schemaName);
    if (!schemaValidator) {
      throw new InternalError('Provided JSON Schema is corrupted');
    }
    if (!schemaValidator(object)) {
      const firstDefaultMessage = JsonSchemaValidator.prepareMessage(schemaValidator, object);
      throw new ValidationError(firstDefaultMessage);
    }
  }

  private static prepareMessage(validate: AnyValidateFunction<unknown> | undefined, obj: any): string {
    // Rest errors
    const firstErrorMessage = validate?.errors?.[0]?.message;
    if (firstErrorMessage !== JsonSchemaValidator.COMMAND_ERROR_MESSAGE) {
      return `${'Malformed patch body'}: ${firstErrorMessage}`;
    }

    const indexElement = Number(validate?.errors?.[0]?.instancePath?.split('/')?.[1]);
    const command = obj?.[indexElement]?.op;
    const path = obj?.[indexElement]?.path;

    return JsonSchemaValidator.COMMAND_ERROR_MESSAGE.slice(0).replace('{0:s}', command).replace('{1:s}', path);
  }
}
