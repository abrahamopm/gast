import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) return;
        const fetchBookings = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/bookings/my/${user.id}`);
                setBookings(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBookings();
    }, [user]);

    if (!user) return <div className="container section-padding">Please login to view dashboard.</div>;

    return (
        <div className="container section-padding fade-in">
            <h2 className="page-title">My Dashboard</h2>
            <div className="user-welcome">
                <h3>Hello, <span className="gold">{user.username}</span></h3>
                <p>Here are your recent bookings.</p>
            </div>

            <div className="bookings-list">
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <div key={booking._id} className="booking-item">
                            <div className="booking-poster">
                                <img src={booking.showtime.movie.posterUrl} alt={booking.showtime.movie.title} />
                            </div>
                            <div className="booking-details">
                                <h3>{booking.showtime.movie.title}</h3>
                                <p><strong>Date:</strong> {new Date(booking.showtime.date).toDateString()}</p>
                                <p><strong>Time:</strong> {booking.showtime.time}</p>
                                <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                                <p><strong>Total:</strong> {booking.totalPrice} ETB</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No bookings found.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
