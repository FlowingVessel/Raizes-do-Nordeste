import { Router } from 'express';
import { PedidosController } from './pedidos.controller';
import { authMiddleware } from '../../middleware/authMiddleware';

const pedidosRoutes = Router();
const pedidosController = new PedidosController();

pedidosRoutes.post('/', authMiddleware, (req, res, next) => {
  pedidosController.criar(req, res).catch(next);
});

pedidosRoutes.patch('/:id/cancelar', authMiddleware, (req, res, next) => {
  pedidosController.cancelar(req, res).catch(next);
});

export { pedidosRoutes };