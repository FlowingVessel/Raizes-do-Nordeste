import { Request, Response } from 'express';
import { PedidosService } from './pedidos.service';

export class PedidosController {
  private pedidosService: PedidosService;

  constructor() {
    this.pedidosService = new PedidosService();
  }

  async criar(req: Request, res: Response) {
    const { unidadeId, itens, formaPagamento } = req.body;
    const clienteId = req.user!.id;

    const pedido = await this.pedidosService.criarPedido({
      clienteId,
      unidadeId,
      formaPagamento,
      itens,
    });

    return res.status(201).json(pedido);
  }

  async cancelar(req: Request, res: Response) {
    const { id } = req.params;

    const pedido = await this.pedidosService.cancelarPedido(id);

    return res.status(200).json(pedido);
  }
}