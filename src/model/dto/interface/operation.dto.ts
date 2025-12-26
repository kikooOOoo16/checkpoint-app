import {CommonObject} from '../../common-object';

/**
 * A DTO representing the operation details.
 *
 * @interface
 */
export interface OperationDTO {
  /**
   * The ID of the operation.
   *
   * @type {string}
   */
  id: string;

  /**
   * The state of the operation.
   *
   * @type {string}
   */
  state: string;

  /**
   * The status code of the operation.
   *
   * @type {number}
   */
  statusCode: number;

  /**
   * The body of the operation.
   *
   * @type {CommonObject}
   */
  body: CommonObject;

  /**
   * The header of the operation.
   *
   * @type {CommonObject}
   */
  header: CommonObject;
}
