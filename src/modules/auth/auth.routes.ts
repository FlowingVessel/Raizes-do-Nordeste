import { Router } from 'express';
import { AuthController } from './auth.controller';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/login', (req, res, next) => {
  authController.login(req, res).catch(next);
});

export { authRoutes };