import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { ZodError } from 'zod';

export function globalErrorHandler(
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.error,
      message: err.message,
      details: err.details,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  }

  if (err instanceof ZodError) {
    return res.status(422).json({
      error: 'VALIDATION_ERROR',
      message: 'Erro de validação nos dados enviados.',
      details: err.errors,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Token de acesso inválido ou expirado.',
      details: [],
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  }

  console.error('❌ ERRO INTERNO:', err);
  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Ocorreu um erro inesperado no servidor.',
    details: process.env.NODE_ENV === 'development' ? [err.message] : [],
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
}