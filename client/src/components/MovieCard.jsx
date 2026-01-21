import { useNavigate } from 'react-router-dom';
import { FaStar, FaClock } from 'react-icons/fa';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <div className="movie-card" onClick={() => navigate(`/movie/${movie._id}`)}>
            <div className="movie-poster">
                <img src={movie.posterUrl} alt={movie.title} />
                <div className="movie-overlay">
                    <button className="btn-primary">Book Now</button>
                </div>
            </div>
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-meta">
                    <span className="genre">{movie.genre.join(', ')}</span>
                    <span className="rating"><FaStar className="star-icon" /> {movie.rating}</span>
                </div>
                <div className="duration"><FaClock className="clock-icon" /> {movie.duration} min</div>
            </div>
        </div>
    );
};

export default MovieCard;
