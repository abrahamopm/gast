const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');

// Get showtimes for a movie
router.get('/movie/:movieId', async (req, res) => {
    try {
        const showtimes = await Showtime.find({ movie: req.params.movieId }).populate('movie');
        res.json(showtimes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single showtime (for booking)
router.get('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id).populate('movie');
        if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
        res.json(showtime);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create showtime (Admin)
router.post('/', async (req, res) => {
    try {
        const showtime = new Showtime(req.body);
        await showtime.save();
        res.status(201).json(showtime);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
