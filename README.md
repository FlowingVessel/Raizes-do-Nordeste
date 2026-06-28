# 🌿 Raízes do Nordeste - API

API RESTful para gestão da Rede "Raízes do Nordeste" — sistema unificado de pedidos,
controle de estoque descentralizado por unidade, pagamentos simulados e programa de
fidelidade para uma rede de lojas de produtos regionais do Nordeste brasileiro.

Desenvolvido como projeto de conclusão de curso para a **UNINTER — 2026**.

## 🚀 Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|------------|--------|
| Runtime | Node.js | 18+ |
| Linguagem | TypeScript | 5.3+ |
| Framework | Express | 4.18 |
| ORM | Prisma | 5.22 |
| Banco de dados | PostgreSQL | 14+ |
| Autenticação | JWT (bcryptjs + jsonwebtoken) | — |
| Validação | Zod | 3.22 |
| Dev server | ts-node-dev | 2.0 |

## 📋 Pré-requisitos

- **Node.js** 18 ou superior
- **PostgreSQL** 14 ou superior
- **npm** (gerenciador de pacotes)
- **Thunder Client** (extensão do VS Code para testes)

## 🔧 Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/raizes-do-nordeste.git
cd raizes-do-nordeste
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/raizes_nordeste?schema=public"
JWT_SECRET="raizes-do-nordeste-secret-key-2026"
PORT=3333
NODE_ENV=development
```

> ⚠️ **Nota:** Ajuste usuário e senha do PostgreSQL conforme sua instalação local.

### 4. Criar o banco de dados

```bash
# Acesse o PostgreSQL e crie o banco
psql -U postgres -c "CREATE DATABASE raizes_nordeste;"
```

### 5. Executar as migrations

```bash
npx prisma migrate dev --name init
```

### 6. Popular o banco com dados de teste

```bash
npm run prisma:seed
```

### 7. Iniciar o servidor

```bash
npm run dev
```

O servidor será iniciado em: **http://localhost:3333**

## 📁 Estrutura do Projeto

```
raizes-do-nordeste-api/
├── prisma/
│   ├── migrations/           # Histórico de migrations
│   ├── schema.prisma         # Modelagem do banco de dados
│   └── seed.ts               # Dados de teste
├── src/
│   ├── config/
│   │   └── database.ts       # Singleton do PrismaClient
│   ├── middleware/
│   │   ├── authMiddleware.ts  # Autenticação JWT + RBAC
│   │   └── globalErrorHandler.ts # Tratamento global de erros
│   ├── modules/
│   │   ├── auth/             # Módulo de autenticação
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── pedidos/          # Módulo de pedidos
│   │   │   ├── pedidos.controller.ts
│   │   │   ├── pedidos.routes.ts
│   │   │   └── pedidos.service.ts
│   │   └── pagamentos/       # Módulo de pagamentos
│   │       ├── pagamentos.controller.ts
│   │       ├── pagamentos.routes.ts
│   │       └── pagamentos.service.ts
│   ├── shared/
│   │   └── errors/
│   │       └── AppError.ts   # Classe de erro padronizada
│   └── server.ts             # Entry point da aplicação
├── .env                      # Variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

## 📡 Endpoints da API

| Método | Rota | Autenticação | Perfis Permitidos | Descrição |
|--------|------|--------------|-------------------|-----------|
| POST | `/api/auth/login` | ❌ Público | — | Login e obtenção de token JWT |
| POST | `/api/pedidos` | ✅ JWT | CLIENTE, ATENDENTE | Criar novo pedido com validação de estoque |
| PATCH | `/api/pedidos/:id/cancelar` | ✅ JWT | CLIENTE, ATENDENTE, GERENTE | Cancelar pedido (devolve estoque) |
| POST | `/api/pagamentos/simular` | ✅ JWT | CLIENTE, ATENDENTE | Simular confirmação de pagamento |

### Exemplo de Requisição — Criar Pedido

```bash
POST http://localhost:3333/api/pedidos
Authorization: Bearer {seu-token-jwt}
Content-Type: application/json

{
  "unidadeId": "uuid-da-unidade",
  "formaPagamento": "PIX",
  "itens": [
    {
      "produtoId": "uuid-do-produto",
      "quantidade": 2
    }
  ]
}
```

### Exemplo de Resposta de Erro (Padrão)

```json
{
  "error": "INSUFFICIENT_STOCK",
  "message": "Estoque insuficiente para o produto na unidade selecionada.",
  "details": [],
  "timestamp": "2026-06-25T20:00:00Z",
  "path": "/api/pedidos"
}
```

## 🧪 Testes

O plano de testes completo com 10 cenários está documentado no guia:

📖 **[GUIA_TESTES_THUNDER_CLIENT.md](./GUIA_TESTES_THUNDER_CLIENT.md)**

### Dados de Teste (Seed)

| Email | Senha | Perfil |
|-------|-------|--------|
| `cliente@email.com` | `123456` | CLIENTE |
| `admin@email.com` | `123456` | ADMIN |

## 🛠️ Scripts Disponíveis

```bash
npm run dev              # Iniciar servidor com hot reload
npm run build            # Compilar TypeScript → JavaScript
npm start                # Iniciar servidor em produção
npm run prisma:migrate   # Executar migrations pendentes
npm run prisma:generate  # Regenerar o Prisma Client
npm run prisma:studio    # Abrir interface visual do banco
npm run prisma:seed      # Popular banco com dados de teste
```

## 🔒 Segurança e LGPD

- Senhas armazenadas com hash **BCrypt** (salt rounds: 10)
- Autenticação via **JWT** com expiração de 1 hora
- Controle de acesso baseado em **perfis (RBAC)**
- **Anonimização** de dados pessoais conforme LGPD (Art. 18)
- Tratamento global de erros sem exposição de dados sensíveis

## 📚 Documentação Acadêmica

- Relatório técnico completo (PDF)
- Plano de testes com 10 cenários
- Prints de execução no Thunder Client
- Diagrama Entidade-Relacionamento (DER)
- Declaração de uso de ferramentas de IA

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina de
**Conclusão de Curso — UNINTER 2026**. Uso autorizado para fins educacionais.

---

**Autor:** Max Lima Sales  
**RU:** 4825402  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Ano:** 2026
```
