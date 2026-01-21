const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gast_cinema')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedMovies = [
    {
        title: "The Grand Budapest Hotel",
        synopsis: "A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotel's glorious years under an exceptional concierge.",
        genre: ["Comedy", "Drama"],
        duration: 100,
        posterUrl: "https://via.placeholder.com/300x450/D4AF37/000000?text=Grand+Budapest",
        rating: 4.5,
        featured: true
    },
    {
        title: "Interstellar",
        synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        genre: ["Sci-Fi", "Adventure"],
        duration: 169,
        posterUrl: "https://via.placeholder.com/300x450/D4AF37/000000?text=Interstellar",
        featured: true
    },
    {
        title: "Inception",
        synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        genre: ["Action", "Sci-Fi"],
        duration: 148,
        posterUrl: "https://via.placeholder.com/300x450/D4AF37/000000?text=Inception"
    },
    {
        title: "Parasite",
        synopsis: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        genre: ["Thriller", "Drama"],
        duration: 132,
        posterUrl: "https://via.placeholder.com/300x450/D4AF37/000000?text=Parasite"
    },
    {
        title: "The Dark Knight",
        synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        genre: ["Action", "Crime"],
        duration: 152,
        posterUrl: "https://via.placeholder.com/300x450/D4AF37/000000?text=Dark+Knight"
    },
    {
        title: "Dune: Part Two",
        synopsis: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        genre: ["Sci-Fi", "Adventure"],
        duration: 166,
        posterUrl: "https://via.placeholder.com/300x450/D4AF37/000000?text=Dune+2",
        featured: true
    },
    {
        title: "Oppenheimer",
        synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        genre: ["Biography", "Drama"],
        duration: 180,
        posterUrl: "https://via.placeholder.com/300x450/D4AF37/000000?text=Oppenheimer"
    },
    {
        title: "Poor Things",
        synopsis: "The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and orthodox scientist Dr. Godwin Baxter.",
        genre: ["Comedy", "Romance"],
        duration: 141,
        posterUrl: "https://via.placeholder.com/300x450/D4AF37/000000?text=Poor+Things"
    }
];

const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
    const seats = [];
    rows.forEach(row => {
        for (let i = 1; i <= 8; i++) {
            seats.push({ id: `${row}${i}`, status: 'available' });
        }
    });
    return seats;
};

const seedDB = async () => {
    try {
        await Movie.deleteMany({});
        await Showtime.deleteMany({});
        await User.deleteMany({});

        // Create Admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            username: 'admin',
            email: 'admin@gast.com',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin created');

        // Create Movies
        const createdMovies = await Movie.insertMany(seedMovies);
        console.log(`${createdMovies.length} movies created`);

        // Create Showtimes
        const showtimes = [];
        createdMovies.forEach(movie => {
            // Create 3 showtimes for each movie: Today, Tomorrow, Day After
            const today = new Date();
            for (let i = 0; i < 3; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);

                // Random time slots
                const times = ['14:00', '17:00', '20:00'];
                times.forEach(time => {
                    showtimes.push({
                        movie: movie._id,
                        date: date,
                        time: time,
                        seats: generateSeats(),
                        price: 300 // ETB presumably
                    });
                });
            }
        });

        await Showtime.insertMany(showtimes);
        console.log(`${showtimes.length} showtimes created`);

        console.log('Database seeded successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
