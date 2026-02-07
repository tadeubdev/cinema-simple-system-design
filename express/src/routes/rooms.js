const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Seat = require('../models/Seat');

// GET /admin/rooms - Listar todas as salas
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /admin/rooms - Criar nova sala
router.post('/', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /admin/rooms/:room_id/seats - Adicionar assento à sala
router.post('/:room_id/seats', async (req, res) => {
  try {
    const { room_id } = req.params;
    const { quantity = 1 } = req.body;

    const seats = [];
    for (let i = 0; i < quantity; i++) {
      const seat = new Seat({ room_id });
      await seat.save();
      seats.push(seat);
    }

    res.status(201).json(seats);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
