import { Router } from 'express';
import { PagamentosController } from './pagamentos.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const pagamentosRoutes = Router();
const pagamentosController = new PagamentosController();

pagamentosRoutes.post('/simular', authMiddleware, (req, res, next) => {
  pagamentosController.simular(req, res).catch(next);
});

export { pagamentosRoutes };