const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
    id: { type: String, required: true }, // e.g., A1, B2
    status: { type: String, enum: ['available', 'booked', 'selected'], default: 'available' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // optional, to track who held it
});

const ShowtimeSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g., "18:00"
    seats: [SeatSchema],
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Showtime', ShowtimeSchema);
