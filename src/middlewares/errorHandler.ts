import { Request, Response, NextFunction } from 'express';
import { normalizerError } from '../utils/handleError';
import { response } from './response';

// Global error handler
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const error = normalizerError(err);

  res
    .status(error.statusCode || 500)
    .json(response.error(error.message, error.details, error.stack));
};
