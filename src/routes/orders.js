const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Ticket = require('../models/Ticket');

// POST /orders - Criar pedido (abrir ordem)
router.post('/', async (req, res) => {
  try {
    const { client_id } = req.body;
    
    const order = new Order({ client_id });
    await order.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /orders/:order_id/tickets - Adicionar ingresso ao pedido
router.post('/:order_id/tickets', async (req, res) => {
  try {
    const { session_id, seat_id } = req.body;
    const { order_id } = req.params;

    // Verificar se o pedido existe e está pendente
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Pedido já foi finalizado' });
    }

    // Verificar se o assento já está reservado para esta sessão
    const existingTicket = await Ticket.findOne({ session_id, seat_id });
    if (existingTicket) {
      return res.status(400).json({ error: 'Assento já reservado para esta sessão' });
    }

    // Criar o ticket
    const ticket = new Ticket({
      order_id,
      session_id,
      seat_id
    });
    await ticket.save();

    res.status(201).json(ticket);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Assento já reservado para esta sessão' });
    }
    res.status(400).json({ error: error.message });
  }
});

// PATCH /orders/:order_id - Atualizar status do pedido (pagar/cancelar)
router.patch('/:order_id', async (req, res) => {
  try {
    const { status } = req.body;
    const { order_id } = req.params;

    if (!['paid', 'canceled'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const order = await Order.findByIdAndUpdate(
      order_id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /orders/:order_id - Ver detalhes do pedido
router.get('/:order_id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.order_id)
      .populate('client_id');
    
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const tickets = await Ticket.find({ order_id: req.params.order_id })
      .populate({
        path: 'session_id',
        populate: {
          path: 'movie_id room_id'
        }
      })
      .populate('seat_id');

    res.json({ order, tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
