const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const cacheMiddleware = require('../middleware/cache');

// GET /admin/movies - Listar todos os filmes (com cache de 120s)
router.get('/', cacheMiddleware(120), async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /admin/movies/:id - Obter detalhes de um filme (com cache de 60s)
router.get('/:id', cacheMiddleware(60), async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /admin/movies - Criar novo filme
router.post('/', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /admin/movies/:id - Atualizar filme
router.patch('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!movie) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /admin/movies/:id - Deletar filme
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }
    res.json({ message: 'Filme deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
