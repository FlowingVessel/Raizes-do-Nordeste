import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';

export class PagamentosService {
  async confirmarPagamento(pedidoId: string) {
    const pedido = await prisma.order.findUnique({
      where: { id: pedidoId },
      include: {
        usuario: true,
      },
    });

    if (!pedido) {
      throw new AppError('Pedido não encontrado.', 404, 'ORDER_NOT_FOUND');
    }

    if (pedido.status !== 'AGUARDANDO_PAGAMENTO') {
      throw new AppError(
        `Pedido não pode ser pago. Status atual: ${pedido.status}`,
        422,
        'INVALID_ORDER_STATUS'
      );
    }

    const cashback = pedido.total * 0.05;

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: pedidoId },
        data: { status: 'PAGO' },
      });

      await tx.user.update({
        where: { id: pedido.userId },
        data: {
          fidelidadePontos: {
            increment: cashback,
          },
        },
      });
    });

    return {
      mensagem: 'Pagamento confirmado com sucesso!',
      pedidoId: pedido.id,
      status: 'PAGO',
      cashbackCreditado: cashback,
    };
  }
}