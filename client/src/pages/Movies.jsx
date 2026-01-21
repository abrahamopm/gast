import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCard from '../components/MovieCard';
import './Movies.css';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [genre, setGenre] = useState('');
    const genres = ["Action", "Sci-Fi", "Drama", "Comedy", "Adventure", "Thriller"];

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/movies', {
                    params: { query, genre }
                });
                setMovies(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        const debounce = setTimeout(fetchMovies, 300);
        return () => clearTimeout(debounce);
    }, [query, genre]);

    return (
        <div className="container section-padding fade-in">
            <h2 className="page-title">Browse Movies</h2>

            <div className="filters">
                <input
                    type="text"
                    placeholder="Search movies..."
                    className="search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="genre-tags">
                    <button
                        className={`genre-tag ${genre === '' ? 'active' : ''}`}
                        onClick={() => setGenre('')}
                    >
                        All
                    </button>
                    {genres.map(g => (
                        <button
                            key={g}
                            className={`genre-tag ${genre === g ? 'active' : ''}`}
                            onClick={() => setGenre(g)}
                        >
                            {g}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid-cols-4">
                {movies.length > 0 ? (
                    movies.map(movie => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))
                ) : (
                    <p>No movies found.</p>
                )}
            </div>
        </div>
    );
};

export default Movies;
