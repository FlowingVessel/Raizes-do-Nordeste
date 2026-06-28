# 🌿 Raízes do Nordeste - API

API RESTful para gestão da Rede Raízes do Nordeste — sistema de pedidos, estoque e pagamentos para uma rede de lojas de produtos regionais do Nordeste brasileiro.

## 🚀 Tecnologias

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework:** Express
- **ORM:** Prisma
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT (bcryptjs + jsonwebtoken)
- **Validação:** Zod
- **Ambiente de desenvolvimento:** ts-node-dev

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm

## 🔧 Instalação e configuração

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/raizes-do-nordeste.git
cd raizes-do-nordeste

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
#    Crie o arquivo .env na raiz com base no modelo abaixo:
```

### Variáveis de ambiente (`.env`)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/raizes_nordeste?schema=public"
JWT_SECRET="sua-chave-secreta-aqui"
PORT=3333
NODE_ENV=development
```

```bash
# 4. Executar as migrations
npx prisma migrate dev

# 5. Popular o banco com dados de teste
npm run prisma:seed

# 6. Iniciar o servidor em desenvolvimento
npm run dev
```

O servidor será iniciado em `http://localhost:3333`.

## 📁 Estrutura do projeto

```
src/
├── config/
│   └── database.ts         # Configuração do PrismaClient
├── middleware/
│   ├── authMiddleware.ts    # Verificação de token JWT
│   └── globalErrorHandler.ts # Tratamento global de erros
├── modules/
│   ├── auth/               # Autenticação (login)
│   │   ├── auth.controller.ts
│   │   ├── auth.routes.ts
│   │   └── auth.service.ts
│   ├── pedidos/            # Pedidos (criar, cancelar)
│   │   ├── pedidos.controller.ts
│   │   ├── pedidos.routes.ts
│   │   └── pedidos.service.ts
│   └── pagamentos/         # Pagamentos (simular)
│       ├── pagamentos.controller.ts
│       ├── pagamentos.routes.ts
│       └── pagamentos.service.ts
├── shared/errors/
│   └── AppError.ts         # Classe de erro padronizada
└── server.ts               # Entry point da aplicação
```

## 📡 Endpoints

| Método | Rota                          | Autenticação | Descrição                          |
|--------|-------------------------------|--------------|------------------------------------|
| POST   | `/api/auth/login`             | ❌           | Login do usuário                   |
| POST   | `/api/pedidos`                | ✅           | Criar novo pedido                  |
| PATCH  | `/api/pedidos/:id/cancelar`   | ✅           | Cancelar pedido (devolve estoque)  |
| POST   | `/api/pagamentos/simular`     | ✅           | Simular pagamento de um pedido     |

## 📖 Guia de testes

Consulte o arquivo [`GUIA_TESTES_THUNDER_CLIENT.md`](./GUIA_TESTES_THUNDER_CLIENT.md) para instruções detalhadas de como testar cada endpoint usando Thunder Client (extensão do VS Code).

## 🧪 Scripts disponíveis

```bash
npm run dev              # Iniciar servidor em modo desenvolvimento
npm run build            # Compilar TypeScript para JavaScript
npm start                # Iniciar servidor em produção
npm run prisma:migrate   # Executar migrations do Prisma
npm run prisma:generate  # Regenerar Prisma Client
npm run prisma:studio    # Abrir Prisma Studio (interface do banco)
npm run prisma:seed      # Popular banco com dados de teste
```

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico para a UNINTER — 2026.