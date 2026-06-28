import { prisma } from '../../config/database';
import { AppError } from '../../shared/errors/AppError';

interface CriarPedidoDTO {
  clienteId: string;
  unidadeId: string;
  formaPagamento: string;
  itens: Array<{
    produtoId: string;
    quantidade: number;
  }>;
}

export class PedidosService {
  async criarPedido(dto: CriarPedidoDTO) {
    const pedido = await prisma.$transaction(async (tx) => {
      for (const item of dto.itens) {
        const estoque = await tx.productStock.findUnique({
          where: {
            productId_unitId: {
              productId: item.produtoId,
              unitId: dto.unidadeId,
            },
          },
        });

        if (!estoque || estoque.quantidade < item.quantidade) {
          throw new AppError(
            `Estoque insuficiente para o produto '${item.produtoId}' na unidade selecionada.`,
            422,
            'INSUFFICIENT_STOCK'
          );
        }
      }

      for (const item of dto.itens) {
        await tx.productStock.update({
          where: {
            productId_unitId: {
              productId: item.produtoId,
              unitId: dto.unidadeId,
            },
          },
          data: {
            quantidade: {
              decrement: item.quantidade,
            },
          },
        });
      }

      const produtosIds = dto.itens.map((i) => i.produtoId);
      const produtos = await tx.product.findMany({
        where: { id: { in: produtosIds } },
      });

      let total = 0;
      const itensParaCriar = dto.itens.map((item) => {
        const produto = produtos.find((p) => p.id === item.produtoId);
        if (!produto) {
          throw new AppError(
            `Produto '${item.produtoId}' não encontrado.`,
            422,
            'PRODUCT_NOT_FOUND'
          );
        }
        const subtotal = produto.preco * item.quantidade;
        total += subtotal;

        return {
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: produto.preco,
        };
      });

      const novoPedido = await tx.order.create({
        data: {
          userId: dto.clienteId,
          unitId: dto.unidadeId,
          formaPagamento: dto.formaPagamento,
          status: 'AGUARDANDO_PAGAMENTO',
          total,
          itens: {
            create: itensParaCriar.map(item => ({
              quantidade: item.quantidade,
              precoUnitario: item.precoUnitario,
              produto: {
                connect: { id: item.produtoId }
              }
            })),
          },
        },
        include: {
          itens: true,
          unidade: {
            select: { id: true, nome: true },
          },
        },
      });

      return novoPedido;
    });

    return pedido;
  }

  async cancelarPedido(pedidoId: string) {
    const pedido = await prisma.order.findUnique({
      where: { id: pedidoId },
      include: {
        itens: true,
        unidade: true,
      },
    });

    if (!pedido) {
      throw new AppError('Pedido não encontrado.', 404, 'ORDER_NOT_FOUND');
    }

    if (pedido.status !== 'AGUARDANDO_PAGAMENTO') {
      throw new AppError(
        `Pedido não pode ser cancelado. Status atual: ${pedido.status}`,
        422,
        'INVALID_ORDER_STATUS'
      );
    }

    const pedidoCancelado = await prisma.$transaction(async (tx) => {
      for (const item of pedido.itens) {
        await tx.productStock.update({
          where: {
            productId_unitId: {
              productId: item.productId,
              unitId: pedido.unitId,
            },
          },
          data: {
            quantidade: {
              increment: item.quantidade,
            },
          },
        });
      }

      const updated = await tx.order.update({
        where: { id: pedidoId },
        data: { status: 'CANCELADO' },
        include: {
          itens: true,
          unidade: {
            select: { id: true, nome: true },
          },
        },
      });

      return updated;
    });

    return pedidoCancelado;
  }
}