import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';
import { JwtPayload } from '../../middleware/authMiddleware';

interface LoginDTO {
  email: string;
  senha: string;
}

export class AuthService {
  async login(dto: LoginDTO) {
    const usuario = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!usuario) {
      throw new AppError('Credenciais inválidas.', 401, 'INVALID_CREDENTIALS');
    }

    const senhaValida = await bcrypt.compare(dto.senha, usuario.passwordHash);
    if (!senhaValida) {
      throw new AppError('Credenciais inválidas.', 401, 'INVALID_CREDENTIALS');
    }

    const payload: JwtPayload = {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'raizes-do-nordeste-secret-key-2026',
      { expiresIn: '8h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }
}