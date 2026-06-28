import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../shared/errors/AppError';

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token de acesso não fornecido.', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'raizes-do-nordeste-secret-key-2026'
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError('Token inválido ou expirado.', 401, 'UNAUTHORIZED');
  }
}

export function authorize(...rolesPermitidas: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, () => {
      if (!req.user || !rolesPermitidas.includes(req.user.role)) {
        throw new AppError(
          'Acesso negado: permissão insuficiente.',
          403,
          'FORBIDDEN'
        );
      }
      next();
    });
  };
}