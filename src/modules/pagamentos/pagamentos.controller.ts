import { Request, Response } from 'express';
import { PagamentosService } from './pagamentos.service';

export class PagamentosController {
  private pagamentosService: PagamentosService;

  constructor() {
    this.pagamentosService = new PagamentosService();
  }

  async simular(req: Request, res: Response) {
    const { pedidoId } = req.body;

    const resultado = await this.pagamentosService.confirmarPagamento(pedidoId);

    return res.status(200).json(resultado);
  }
}