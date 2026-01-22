import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlay, FaStar, FaTicketAlt, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const heroRef = useRef(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/movies');
                setMovies(res.data);
                const featured = res.data.filter(m => m.featured);
                setFeaturedMovies(featured.length > 0 ? featured : res.data.slice(0, 5));
            } catch (err) {
                console.error(err);
            }
        };
        fetchMovies();
    }, []);

    // Cinematic Auto-Play Slider
    useEffect(() => {
        if (featuredMovies.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % featuredMovies.length);
        }, 8000); // 8 seconds per slide for cinematic feel
        return () => clearInterval(interval);
    }, [featuredMovies]);

    const activeMovie = featuredMovies[activeIndex];

    if (!activeMovie) return <div className="loader"></div>;

    return (
        <div className="home-container">
            {/* 1. Cinematic Hero Section */}
            <div className="cinematic-hero">
                <div className="hero-backdrop" style={{ backgroundImage: `url(${activeMovie.posterUrl})` }}></div>
                <div className="hero-overlay"></div>

                <div className="hero-content container">
                    <div className="hero-text-content slide-up">
                        <div className="hero-badges">
                            <span className="badge premium">💎 Premium Experience</span>
                            <span className="badge rating"><FaStar /> {activeMovie.rating}/5</span>
                        </div>

                        <h1 className="hero-title">{activeMovie.title}</h1>

                        <div className="hero-meta">
                            <span>{activeMovie.genre.join(' | ')}</span>
                            <span className="separator">•</span>
                            <span>{activeMovie.duration} MIN</span>
                            <span className="separator">•</span>
                            <span>4K DOLBY ATMOS</span>
                        </div>

                        <p className="hero-synopsis">{activeMovie.synopsis}</p>

                        <div className="hero-actions">
                            <button className="btn-hero primary" onClick={() => window.location.href = `/movie/${activeMovie._id}`}>
                                <FaTicketAlt /> Book Tickets
                            </button>
                            <button className="btn-hero secondary" onClick={() => window.location.href = `/movie/${activeMovie._id}`}>
                                <FaInfoCircle /> More Info
                            </button>
                        </div>
                    </div>

                    {/* 3D Poster Card */}
                    <div className="hero-poster-3d float-animation">
                        <img src={activeMovie.posterUrl} alt={activeMovie.title} />
                        <div className="poster-reflection"></div>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="hero-indicators">
                    {featuredMovies.map((_, idx) => (
                        <div
                            key={idx}
                            className={`indicator-line ${idx === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(idx)}
                        >
                            <div className="progress"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Glassmorphism Movies Showcase */}
            <section className="showcase-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Now Showing</h2>
                        <a href="/movies" className="view-all">View All <FaChevronRight /></a>
                    </div>

                    <div className="movie-grid-modern">
                        {movies.slice(0, 8).map(movie => (
                            <div key={movie._id} className="movie-card-modern" onClick={() => window.location.href = `/movie/${movie._id}`}>
                                <div className="card-image">
                                    <img src={movie.posterUrl} alt={movie.title} />
                                    <div className="card-overlay">
                                        <button className="btn-book-now">Book Now</button>
                                    </div>
                                </div>
                                <div className="card-info">
                                    <h3>{movie.title}</h3>
                                    <p>{movie.genre[0]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. The Royal Experience */}
            <section className="experience-section">
                <div className="experience-bg"></div>
                <div className="container experience-content">
                    <span className="sub-heading">Redefining Cinema</span>
                    <h2>The Royal Experience</h2>
                    <p>
                        Step into a world where luxury meets technology.
                        Our private suites feature fully reclining Italian leather seats,
                        personal butler service, and a curated gourmet menu delivered to your seat.
                    </p>

                    <div className="feature-grid">
                        <div className="feature-item">
                            <span className="feature-icon">🎬</span>
                            <h4>Laser IMAX 4K</h4>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🔊</span>
                            <h4>Dolby Atmos 360°</h4>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🍷</span>
                            <h4>VIP Lounge Access</h4>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
