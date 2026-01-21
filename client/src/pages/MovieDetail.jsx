import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlay, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './MovieDetail.css';

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieRes = await axios.get(`http://localhost:5000/api/movies/${id}`);
                setMovie(movieRes.data);

                const showtimeRes = await axios.get(`http://localhost:5000/api/showtimes/movie/${id}`);
                setShowtimes(showtimeRes.data);

                if (showtimeRes.data.length > 0) {
                    // Group by date or just select first date found? 
                    // Let's just default to first available date
                    setSelectedDate(new Date(showtimeRes.data[0].date).toDateString());
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchMovieData();
    }, [id]);

    if (!movie) return <div className="loading">Loading...</div>;

    // Filter showtimes by selected date
    const uniqueDates = [...new Set(showtimes.map(s => new Date(s.date).toDateString()))];
    const filteredShowtimes = showtimes.filter(s => new Date(s.date).toDateString() === selectedDate);

    return (
        <div className="movie-detail fade-in">
            <div className="detail-hero" style={{ backgroundImage: `linear-gradient(to right, var(--color-black-main) 30%, transparent), url(${movie.posterUrl})` }}>
                <div className="container detail-content">
                    <div className="poster-wrapper">
                        <img src={movie.posterUrl} alt={movie.title} />
                    </div>
                    <div className="info-wrapper">
                        <h1>{movie.title}</h1>
                        <div className="meta-tags">
                            {movie.genre.map(g => <span key={g} className="tag">{g}</span>)}
                            <span>{movie.duration} min</span>
                        </div>
                        <p className="synopsis">{movie.synopsis}</p>

                        <div className="actions">
                            <button className="btn-outline"><FaPlay /> Watch Trailer</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container section-padding booking-section">
                <h2>Select Showtime</h2>

                <div className="date-selector">
                    {uniqueDates.map(date => (
                        <button
                            key={date}
                            className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <FaCalendarAlt /> {date}
                        </button>
                    ))}
                </div>

                <div className="time-grid">
                    {filteredShowtimes.length > 0 ? (
                        filteredShowtimes.map(st => (
                            <button
                                key={st._id}
                                className="time-btn"
                                onClick={() => navigate(`/booking/seats/${st._id}`)}
                            >
                                <FaClock /> {st.time}
                            </button>
                        ))
                    ) : (
                        <p>No showtimes available for this date.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
