import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    const resultado = await this.authService.login({ email, senha });

    return res.status(200).json(resultado);
  }
}