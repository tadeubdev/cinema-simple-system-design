const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Seat = require('../models/Seat');
const Ticket = require('../models/Ticket');

// GET /admin/movies/:movie_id/sessions - Criar sessão para um filme
router.post('/', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /movies/:movie_id/sessions - Listar sessões de um filme
router.get('/', async (req, res) => {
  try {
    const { date_start, date_end } = req.query;
    const query = {};
    
    if (date_start && date_end) {
      query.start_at = {
        $gte: new Date(date_start),
        $lte: new Date(date_end)
      };
    }

    const sessions = await Session.find(query)
      .populate('movie_id')
      .populate('room_id');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /sessions/:session_id/seats - Ver assentos disponíveis
router.get('/:session_id/seats', async (req, res) => {
  try {
    const session = await Session.findById(req.params.session_id);
    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }

    // Buscar todos os assentos da sala
    const seats = await Seat.find({ 
      room_id: session.room_id,
      active: true 
    });

    // Buscar assentos já reservados para esta sessão
    const reservedTickets = await Ticket.find({ 
      session_id: req.params.session_id 
    }).select('seat_id');
    
    const reservedSeatIds = reservedTickets.map(t => t.seat_id.toString());

    // Marcar assentos como disponíveis ou não
    const seatsWithAvailability = seats.map(seat => ({
      _id: seat._id,
      room_id: seat.room_id,
      available: !reservedSeatIds.includes(seat._id.toString())
    }));

    res.json(seatsWithAvailability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /admin/movies/:movie_id/sessions/:id - Atualizar sessão
router.patch('/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /admin/movies/:movie_id/sessions/:id - Deletar sessão
router.delete('/:id', async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Sessão não encontrada' });
    }
    res.json({ message: 'Sessão deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
