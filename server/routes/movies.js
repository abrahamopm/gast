const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');

// Get all movies (with optional search/filter)
router.get('/', async (req, res) => {
    try {
        const { query, genre } = req.query;
        let filter = {};
        if (query) {
            filter.title = { $regex: query, $options: 'i' };
        }
        if (genre) {
            filter.genre = genre;
        }
        const movies = await Movie.find(filter);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single movie
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });
        res.json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create movie (Admin only - simplified for now without middleware check)
router.post('/', async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
