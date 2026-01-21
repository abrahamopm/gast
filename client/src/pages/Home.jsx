import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import './Home.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/movies');
                setMovies(res.data);
                // Filter featured movies for slider
                const featured = res.data.filter(m => m.featured);
                setFeaturedMovies(featured.length > 0 ? featured : res.data.slice(0, 3));
            } catch (err) {
                console.error(err);
            }
        };
        fetchMovies();
    }, []);

    // Auto-slide effect
    useEffect(() => {
        if (featuredMovies.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [featuredMovies]);

    const currentMovie = featuredMovies[currentIndex];
    const nowShowing = movies.filter(m => !featuredMovies.find(f => f._id === m._id));

    return (
        <div className="home-page fade-in">
            {currentMovie && (
                <header className="hero" style={{ '--hero-bg': `url(${currentMovie.posterUrl})` }}>
                    <div className="container hero-content">
                        <span className="hero-tag">Now Showing &bull; Premiere</span>
                        <h1 className="hero-title fade-in-up" key={currentMovie._id}>{currentMovie.title}</h1>
                        <p className="hero-synopsis fade-in-up-delay">{currentMovie.synopsis}</p>
                        <div className="hero-meta fade-in-up-delay">
                            <span>{currentMovie.genre.join(' • ')}</span>
                            <span>{currentMovie.duration} min</span>
                        </div>
                        <div className="hero-actions fade-in-up-delay-2">
                            <button className="btn-primary" onClick={() => window.location.href = `/movie/${currentMovie._id}`}>
                                Book Tickets
                            </button>
                            <div className="slider-dots">
                                {featuredMovies.map((_, idx) => (
                                    <span
                                        key={idx}
                                        className={`dot ${idx === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(idx)}
                                    ></span>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <section className="section-padding container">
                <div className="section-header">
                    <h2>Now Showing</h2>
                    <a href="/movies" className="btn-outline small">View All</a>
                </div>
                <div className="grid-cols-4">
                    {nowShowing.map(movie => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>
            </section>

            {/* New Luxury Section */}
            <section className="luxury-section section-padding">
                <div className="container">
                    <div className="luxury-content">
                        <h2>The Royal Experience</h2>
                        <p>Immerse yourself in a cinematic journey like no other. Our state-of-the-art halls, reclining gold-class seats, and gourmet service redefine entertainment.</p>
                        <button className="btn-outline">Explore Our Halls</button>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter-section section-padding container">
                <div className="newsletter-box">
                    <h2>Join the Exclusive Club</h2>
                    <p>Be the first to know about premieres, red carpet events, and exclusive offers.</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Your Email Address" />
                        <button className="btn-primary">Subscribe</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
