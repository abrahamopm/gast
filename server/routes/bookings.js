const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

// Create Booking
router.post('/', async (req, res) => {
    const { user_id, showtime_id, seats, total_price } = req.body;
    try {
        // Start transaction (simplified)
        const showtime = await Showtime.findById(showtime_id);
        if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

        // Check availability
        const available = seats.every(seatId => {
            const seat = showtime.seats.find(s => s.id === seatId);
            return seat && seat.status === 'available';
        });

        if (!available) return res.status(400).json({ message: 'One or more seats are not available' });

        // Update seats
        seats.forEach(seatId => {
            const seat = showtime.seats.find(s => s.id === seatId);
            seat.status = 'booked';
            seat.user = user_id;
        });
        await showtime.save();

        // Create booking
        const booking = new Booking({
            user: user_id,
            showtime: showtime_id,
            seats,
            totalPrice: total_price
        });
        await booking.save();

        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Bookings
router.get('/my/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate({
                path: 'showtime',
                populate: { path: 'movie' }
            });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
