import {Request, Response} from 'express';
import {String as stringOperations} from 'typescript-string-operations';
import {IllegalHeaderError} from '../errors';

/**
 * Middleware for validating request headers
 */
export namespace HeaderValidationMiddleware {
  export const MISSING_HEADER_ERR = 'Mandatory header {0} is missing in request';
  export const WRONG_CONTENT_TYPE_ERR = 'Content-Type {0} is not applicable to this request';
  export const WRONG_ACCEPT_ERR = 'Accept header {0} is not applicable to this request';

  export const ACCEPT = 'Accept';
  export const CONTENT_TYPE = 'Content-Type';

  export const APPLICATION_JSON = 'application/json';
  export const APPLICATION_JSON_PATCH = 'application/json-patch+json';
  export const APPLICATION_JSON_PATCH_QUERY = 'application/json-patch-query+json';
  export const ALL = '*/*';
  export const APPLICATION_ALL = 'application/*';

  const getHeaderFieldValue: (headerField: string, request: Request, isMandatory?: boolean) => string | undefined = (
    headerField,
    request,
    isMandatory = false
  ) => {
    const headers = request.headers;
    const value = headers[headerField.toLowerCase()];
    if (Array.isArray(value)) {
      return;
    }

    if (value) {
      return value;
    }

    if (isMandatory) {
      throw new IllegalHeaderError(stringOperations.Format(MISSING_HEADER_ERR, headerField));
    }
  };

  const validateHeader: (expectedHeaders: string[], header: string | undefined, errorMsg: string) => void = (
    expectedHeaders,
    header,
    errorMsg
  ) => {
    if (header && expectedHeaders?.every(expectedHeader => expectedHeader !== header)) {
      throw new IllegalHeaderError(errorMsg);
    }
  };

  export function AcceptHeaderValidatorMiddleware(
    ...accepted: string[]
  ): (request: Request, response: Response, next: (err?: any) => any) => void {
    return (request, response, next) => {
      try {
        const acceptHeader = getHeaderFieldValue(ACCEPT, request);
        validateHeader(accepted, acceptHeader, stringOperations.Format(WRONG_ACCEPT_ERR, acceptHeader));
      } catch (e) {
        next(e);
      }
      next();
    };
  }

  export function ContentTypeHeaderValidatorMiddleware(
    ...expectedContentTypes: string[]
  ): (request: Request, response: Response, next: (err?: any) => any) => void {
    return (request, response, next) => {
      try {
        const contentTypeHeader = getHeaderFieldValue(CONTENT_TYPE, request, true);
        validateHeader(
          expectedContentTypes,
          contentTypeHeader,
          stringOperations.Format(WRONG_CONTENT_TYPE_ERR, contentTypeHeader)
        );
      } catch (e) {
        next(e);
      }
      next();
    };
  }
}
