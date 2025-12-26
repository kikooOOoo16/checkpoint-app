import {ProblemDetailsDTO} from '../model';
import {BaseError} from './base.error';

/**
 * Custom error class for when no entities are found.
 * @extends BaseError
 */
export class NoEntitiesFoundError extends BaseError {
  /**
   * Creates a new instance of NoEntitiesFoundError.
   * @param {ProblemDetailsDTO} errorObj - The problem details object describing the error.
   */
  constructor(public readonly errorObj: ProblemDetailsDTO) {
    super();
  }

  /**
   * Returns error data object
   * @returns {ProblemDetailsDTO} The problem details object describing the error.
   */
  data(): ProblemDetailsDTO {
    return this.errorObj;
  }
}
