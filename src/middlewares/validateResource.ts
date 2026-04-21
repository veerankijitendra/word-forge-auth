import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { response } from './response';

export const validateResource =
  (schema: ZodTypeAny, source: 'body' | 'query' | 'params' | 'cookies') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`Validating ${source} with schema:`, req[source]);
      schema.parse(req[source]);
      next();
    } catch (e: any) {
      if (e instanceof ZodError) {
        return res.status(400).json(response.error('Validation failed', e.issues));
      }
      next(e);
    }
  };
