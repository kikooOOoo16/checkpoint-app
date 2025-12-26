import {NextFunction, Request, Response} from 'express';
import {JsonSchemaValidator} from '../../util';

export const validateBody = (schemaName: string) => {
  const validator = JsonSchemaValidator.getInstance();

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      validator.validate(req.body, schemaName);
      next();
    } catch (error: any) {
      const errorMessage = error.message;

      if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
        return res.status(400).json({error: errorMessage});
      }

      (req.session as any).error = errorMessage;
      return res.redirect('back');
    }
  };
};
