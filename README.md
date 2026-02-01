# Sistema de Cinema - API

Sistema de gerenciamento de cinema com Express.js, MongoDB e Docker.

![system-diagram](/system-design.png)

## Como rodar o projeto

### Usando Docker (recomendado)

1. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

2. Inicie os containers:
```bash
docker-compose up -d
```

A API estará disponível em: `http://localhost:3000`

MongoDB estará em: `localhost:27017`

3. Para parar os containers:
```bash
docker-compose down
```

### Localmente (sem Docker)

1. Instale as dependências:
```bash
npm install
```

2. Configure o arquivo `.env` com suas credenciais do MongoDB

3. Inicie o servidor:
```bash
npm start
```

## Endpoints da API

### Filmes (Admin)
- `GET /admin/movies` - Listar todos os filmes
- `GET /admin/movies/:id` - Detalhes de um filme
- `POST /admin/movies` - Criar novo filme
- `PATCH /admin/movies/:id` - Atualizar filme
- `DELETE /admin/movies/:id` - Deletar filme

### Salas (Admin)
- `GET /admin/rooms` - Listar todas as salas
- `POST /admin/rooms` - Criar nova sala
- `POST /admin/rooms/:room_id/seats` - Adicionar assentos à sala

### Sessões
- `POST /sessions` - Criar nova sessão
- `GET /sessions` - Listar sessões (com filtro por data)
- `GET /sessions/:session_id/seats` - Ver assentos disponíveis
- `PATCH /sessions/:id` - Atualizar sessão
- `DELETE /sessions/:id` - Deletar sessão

### Clientes
- `POST /clients` - Criar cliente
- `GET /clients` - Listar clientes

### Pedidos
- `POST /orders` - Criar pedido
- `POST /orders/:order_id/tickets` - Adicionar ingresso ao pedido
- `PATCH /orders/:order_id` - Atualizar status do pedido (pagar/cancelar)
- `GET /orders/:order_id` - Ver detalhes do pedido

## Estrutura do Projeto

```
cinema/
├── src/
│   ├── models/          # Modelos do MongoDB
│   │   ├── Movie.js
│   │   ├── Room.js
│   │   ├── Session.js
│   │   ├── Seat.js
│   │   ├── Client.js
│   │   ├── Order.js
│   │   └── Ticket.js
│   ├── routes/          # Rotas da API
│   │   ├── movies.js
│   │   ├── rooms.js
│   │   ├── sessions.js
│   │   ├── clients.js
│   │   └── orders.js
│   └── server.js        # Arquivo principal
├── docker-compose.yml
├── Dockerfile
└── package.json
```

## Credenciais padrão do MongoDB (Docker)

- Usuário: `admin`
- Senha: `senha123`
- Database: `cinema`

## Exemplo de uso

### 1. Criar um filme
```bash
curl -X POST http://localhost:3000/admin/movies \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Filme Exemplo",
    "description": "Descrição do filme",
    "duration_min": 120,
    "date_start": "2026-02-01",
    "date_end": "2026-03-01"
  }'
```

### 2. Criar uma sala
```bash
curl -X POST http://localhost:3000/admin/rooms \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sala 1"
  }'
```

### 3. Adicionar assentos à sala
```bash
curl -X POST http://localhost:3000/admin/rooms/{room_id}/seats \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 50
  }'
```

### 4. Criar uma sessão
```bash
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "movie_id": "{movie_id}",
    "room_id": "{room_id}",
    "start_at": "2026-02-15T19:00:00",
    "finish_at": "2026-02-15T21:00:00"
  }'
```

### 5. Criar cliente
```bash
curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva"
  }'
```

### 6. Criar pedido e comprar ingresso
```bash
# Criar pedido
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "{client_id}"
  }'

# Adicionar ingresso
curl -X POST http://localhost:3000/orders/{order_id}/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "{session_id}",
    "seat_id": "{seat_id}"
  }'

# Pagar pedido
curl -X PATCH http://localhost:3000/orders/{order_id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paid"
  }'
```
