import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaFilm, FaCalendarAlt, FaUsers, FaSignOutAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ revenue: 0, totalBookings: 0, activeMovies: 0 });
    const [movies, setMovies] = useState([]);

    // Check Admin Role
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        // Fetch Stats (Simulated or Real)
        const fetchData = async () => {
            try {
                const moviesRes = await axios.get('http://localhost:5000/api/movies');
                setMovies(moviesRes.data);

                // Simulated Stats for now
                setStats({
                    revenue: 450200,
                    totalBookings: 1245,
                    activeMovies: moviesRes.data.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="dashboard-content fade-in">
                        <h2 className="section-title">Overview</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon gold"><FaChartLine /></div>
                                <div className="stat-info">
                                    <h3>Total Revenue</h3>
                                    <p>{stats.revenue.toLocaleString()} ETB</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon blue"><FaUsers /></div>
                                <div className="stat-info">
                                    <h3>Total Bookings</h3>
                                    <p>{stats.totalBookings}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon purple"><FaFilm /></div>
                                <div className="stat-info">
                                    <h3>Active Movies</h3>
                                    <p>{stats.activeMovies}</p>
                                </div>
                            </div>
                        </div>

                        <div className="recent-activity">
                            <h3>Remember: "Great power comes with great responsibility."</h3>
                            <p>Manage your cinema wisely.</p>
                        </div>
                    </div>
                );
            case 'movies':
                return (
                    <div className="dashboard-content fade-in">
                        <div className="section-header-admin">
                            <h2 className="section-title">Manage Movies</h2>
                            <button className="btn-admin-primary"><FaPlus /> Add New Movie</button>
                        </div>
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Poster</th>
                                        <th>Title</th>
                                        <th>Genre</th>
                                        <th>Duration</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movies.map(movie => (
                                        <tr key={movie._id}>
                                            <td><img src={movie.posterUrl} alt={movie.title} className="table-poster" /></td>
                                            <td>{movie.title}</td>
                                            <td>{movie.genre.join(', ')}</td>
                                            <td>{movie.duration}m</td>
                                            <td>
                                                <button className="icon-btn edit"><FaEdit /></button>
                                                <button className="icon-btn delete"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div className="admin-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Gast Admin</h2>
                </div>
                <nav className="sidebar-nav">
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                        <FaChartLine /> Overview
                    </button>
                    <button className={activeTab === 'movies' ? 'active' : ''} onClick={() => setActiveTab('movies')}>
                        <FaFilm /> Movies
                    </button>
                    <button className={activeTab === 'showtimes' ? 'active' : ''} onClick={() => setActiveTab('showtimes')}>
                        <FaCalendarAlt /> Showtimes
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn"><FaSignOutAlt /> Logout</button>
                </div>
            </aside>
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;
