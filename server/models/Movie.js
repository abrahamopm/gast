const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    synopsis: { type: String },
    genre: { type: [String] },
    duration: { type: Number }, // in minutes
    posterUrl: { type: String },
    rating: { type: Number, default: 0 },
    releaseDate: { type: Date },
    featured: { type: Boolean, default: false } // for Hero section
});

module.exports = mongoose.model('Movie', MovieSchema);
