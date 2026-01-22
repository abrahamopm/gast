import { Link, useNavigate } from 'react-router-dom';
import { FaFilm } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    <FaFilm className="logo-icon" />
                    <span>Gast Cinema</span>
                </Link>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/movies" className="nav-link">Movies</Link>
                    {isLoggedIn && <Link to="/dashboard" className="nav-link">My Bookings</Link>}

                    {isLoggedIn ? (
                        <button onClick={handleLogout} className="btn-outline small">Logout</button>
                    ) : (
                        <Link to="/login" className="btn-outline small">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
