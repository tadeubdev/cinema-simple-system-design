require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { connectRedis } = require('./config/redis');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexão com MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cinema';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Conexão com Redis
connectRedis();

// Importar rotas
const moviesRoutes = require('./routes/movies');
const sessionsRoutes = require('./routes/sessions');
const ordersRoutes = require('./routes/orders');
const roomsRoutes = require('./routes/rooms');
const clientsRoutes = require('./routes/clients');

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Cinema - Sistema de Ingressos',
  });
});

// Rotas da API
app.use('/admin/movies', moviesRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/orders', ordersRoutes);
app.use('/admin/rooms', roomsRoutes);
app.use('/clients', clientsRoutes);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
