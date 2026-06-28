import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  const unidade1 = await prisma.unit.create({
    data: { nome: 'Raízes - Centro', cidade: 'Fortaleza' },
  });
  const unidade2 = await prisma.unit.create({
    data: { nome: 'Raízes - Shopping', cidade: 'Fortaleza' },
  });

  const produtos = await Promise.all([
    prisma.product.create({ data: { nome: 'Castanha de Caju', preco: 25.90, descricao: 'Pacote 500g' } }),
    prisma.product.create({ data: { nome: 'Rapadura', preco: 8.50, descricao: 'Unidade 300g' } }),
    prisma.product.create({ data: { nome: 'Cachaça Artesanal', preco: 45.00, descricao: 'Garrafa 750ml' } }),
    prisma.product.create({ data: { nome: 'Bolo de Macaxeira', preco: 15.00, descricao: 'Unidade' } }),
  ]);

  for (const produto of produtos) {
    await prisma.productStock.create({
      data: { productId: produto.id, unitId: unidade1.id, quantidade: 100 },
    });
    await prisma.productStock.create({
      data: { productId: produto.id, unitId: unidade2.id, quantidade: 50 },
    });
  }

  const senhaHash = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      nome: 'Cliente Teste',
      email: 'cliente@email.com',
      passwordHash: senhaHash,
      role: Role.CLIENTE,
    },
  });

  await prisma.user.create({
    data: {
      nome: 'Admin Sistema',
      email: 'admin@email.com',
      passwordHash: senhaHash,
      role: Role.ADMINISTRADOR,
    },
  });

  console.log('✅ Seed concluído!');
  console.log('👤 Usuários criados (senha: 123456)');
  console.log('   - cliente@email.com (CLIENTE)');
  console.log('   - admin@email.com (ADMINISTRADOR)');
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });