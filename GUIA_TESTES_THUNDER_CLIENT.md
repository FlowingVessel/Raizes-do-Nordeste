# 🧪 GUIA DE TESTES - THUNDER CLIENT

## 📋 Pré-requisito: Obter IDs do Banco

Antes de começar, você precisa dos IDs das unidades e produtos. Execute:

```bash
npx prisma studio
```

Abra o navegador em `http://localhost:5555` e copie:

### IDs Necessários:

**Unidades (tabela `units`):**
- `id` da unidade "Raízes - Centro" (ex: `cede33a7-bc2e-430c-bd66-d9a3a5c96685`)
- `id` da unidade "Raízes - Shopping" (ex: `29f5e097-e20e-495d-bc13-af90e9931e52`)

**Produtos (tabela `products`):**
- `id` do "Castanha de Caju" (ex: `6ac51c37-9bfd-42b7-ad2a-57e3140b0010`)
- `id` da "Rapadura" (ex: `b3d3b3c1-9b7d-4fc8-b7c3-844ab94af0f9`)
- `id` da "Cachaça Artesanal" (ex: `7b05c3d6-1970-47d6-923f-d9ac93152081`)
- `id` do "Bolo de Macaxeira" (ex: `32f3ca4d-4c29-43ed-90ea-4fc4d5e9ffd7`)

---

## 🔐 TESTE 1: Login com Sucesso (CLIENTE)

**Método:** `POST`  
**URL:** `http://localhost:3333/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "cliente@email.com",
  "senha": "123456"
}
```

**✅ Verificar na resposta:**
- Status: `200 OK`
- Contém campo `token` (string longa começando com `eyJ...`)
- Contém campo `usuario` com:
  - `id`: (UUID do usuário)
  - `nome`: "Cliente Teste"
  - `email`: "cliente@email.com"
  - `role`: "CLIENTE"

**📸 Print sugerido:** Mostrar a resposta completa com o token

---

## 🔐 TESTE 2: Login com Credenciais Inválidas

**Método:** `POST`  
**URL:** `http://localhost:3333/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "cliente@email.com",
  "senha": "senha_errada"
}
```

**✅ Verificar na resposta:**
- Status: `401 Unauthorized`
- JSON contém:
  - `error`: "INVALID_CREDENTIALS"
  - `message`: "Credenciais inválidas."
  - `details`: `[]` (array vazio)
  - `timestamp`: (data/hora ISO)
  - `path`: "/api/auth/login"

**📸 Print sugerido:** Mostrar o erro 401 com o formato padronizado

---

## 🛒 TESTE 3: Criar Pedido com Sucesso

**Método:** `POST`  
**URL:** `http://localhost:3333/api/pedidos`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {TOKEN_DO_TESTE_1}
```

**Body (JSON):**
```json
{
  "unidadeId": "COPIE_O_ID_DA_UNIDADE_AQUI",
  "formaPagamento": "PIX",
  "itens": [
    {
      "produtoId": "COPIE_O_ID_DO_PRODUTO_AQUI",
      "quantidade": 2
    }
  ]
}
```

**✅ Verificar na resposta:**
- Status: `201 Created`
- Contém `id`: (UUID do pedido criado)
- Contém `status`: "AGUARDANDO_PAGAMENTO"
- Contém `total`: (preço × quantidade, ex: 25.90 × 2 = 51.80)
- Contém `itens`: array com 1 item
- Contém `unidade`: { id, nome }

**📸 Print sugerido:** Mostrar o pedido criado com todos os dados

---

## ❌ TESTE 4: Criar Pedido com Estoque INSUFICIENTE

**Método:** `POST`  
**URL:** `http://localhost:3333/api/pedidos`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {TOKEN_DO_TESTE_1}
```

**Body (JSON):**
```json
{
  "unidadeId": "COPIE_O_ID_DA_UNIDADE_AQUI",
  "formaPagamento": "PIX",
  "itens": [
    {
      "produtoId": "COPIE_O_ID_DO_PRODUTO_AQUI",
      "quantidade": 99999
    }
  ]
}
```

**✅ Verificar na resposta:**
- Status: `422 Unprocessable Entity`
- JSON contém:
  - `error`: "INSUFFICIENT_STOCK"
  - `message`: "Estoque insuficiente para o produto '...' na unidade selecionada."
  - `details`: `[]`
  - `timestamp`: (data/hora)
  - `path`: "/api/pedidos"

**📸 Print sugerido:** Mostrar o erro 422 com a mensagem de estoque insuficiente

---

## 💳 TESTE 5: Simular Pagamento e Verificar Cashback

**Método:** `POST`  
**URL:** `http://localhost:3333/api/pagamentos/simular`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {TOKEN_DO_TESTE_1}
```

**Body (JSON):**
```json
{
  "pedidoId": "COPIE_O_ID_DO_PEDIDO_DO_TESTE_3"
}
```

**✅ Verificar na resposta:**
- Status: `200 OK`
- Contém:
  - `mensagem`: "Pagamento confirmado com sucesso!"
  - `pedidoId`: (mesmo ID enviado)
  - `status`: "PAGO"
  - `cashbackCreditado`: (5% do total, ex: 51.80 × 0.05 = 2.59)

**📸 Print sugerido:** 
1. Mostrar a resposta do pagamento
2. Abrir Prisma Studio e mostrar que `fidelidadePontos` do usuário foi incrementado

---

## 🔍 COMO VERIFICAR O CASHBACK NO PRISMA STUDIO

1. Execute: `npx prisma studio`
2. Abra `http://localhost:5555`
3. Vá na tabela `users`
4. Encontre o usuário "Cliente Teste"
5. Verifique que o campo `fidelidadePontos` aumentou em 5% do valor do pedido

**Exemplo:**
- Pedido: R$ 51.80
- Cashback (5%): R$ 2.59
- `fidelidadePontos` anterior: 0.0
- `fidelidadePontos` atual: 2.59

---

## 📊 RESUMO DOS TESTES

| Teste | Método | URL | Status Esperado | Verificação Principal |
|-------|--------|-----|-----------------|----------------------|
| 1 | POST | /api/auth/login | 200 OK | Token JWT + role CLIENTE |
| 2 | POST | /api/auth/login | 401 Unauthorized | error: INVALID_CREDENTIALS |
| 3 | POST | /api/pedidos | 201 Created | Pedido com status AGUARDANDO_PAGAMENTO |
| 4 | POST | /api/pedidos | 422 Unprocessable | error: INSUFFICIENT_STOCK |
| 5 | POST | /api/pagamentos/simular | 200 OK | cashbackCreditado (5%) |

---

## 🚨 DICAS IMPORTANTES

1. **Copie o token do Teste 1** e use nos testes 3, 4 e 5
2. **Substitua os IDs** pelos IDs reais do seu banco (via Prisma Studio)
3. **Use o mesmo pedidoId** do Teste 3 no Teste 5
4. **Verifique o console do servidor** (terminal onde está rodando `npm run dev`) para ver os logs
5. **Se der erro 500**, verifique se o token não expirou (faça login novamente)

---

## 📝 CHECKLIST PARA A BANCA

Após executar todos os testes, confira:

- [ ] Teste 1: Login retorna 200 com token e role correta
- [ ] Teste 2: Login inválido retorna 401 com formato padronizado
- [ ] Teste 3: Pedido criado com 201, status correto e total calculado
- [ ] Teste 4: Estoque insuficiente retorna 422 com erro INSUFFICIENT_STOCK
- [ ] Teste 5: Pagamento retorna 200 com cashback de 5% creditado
- [ ] Prisma Studio mostra `fidelidadePontos` incrementado
- [ ] Console do servidor mostra as queries SQL (modo development)

---

Boa sorte com os testes! 🚀