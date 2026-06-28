import express from 'express';
import cors from 'cors';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { authRoutes } from './modules/auth/auth.routes';
import { pedidosRoutes } from './modules/pedidos/pedidos.routes';
import { pagamentosRoutes } from './modules/pagamentos/pagamentos.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/pagamentos', pagamentosRoutes);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Rotas disponíveis:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   POST http://localhost:${PORT}/api/pedidos`);
  console.log(`   POST http://localhost:${PORT}/api/pagamentos/simular`);
});

export { app };