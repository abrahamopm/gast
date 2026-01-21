import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showtime, selectedSeats, totalPrice } = location.state || {};
    const [submitting, setSubmitting] = useState(false);

    // Mock user ID for now (or get from context if implemented)
    // For demo purposes, we'll create a user on fly or use hardcoded if not logged in?
    // Let's assume user is not logged in and just skip auth check for "Demo" 
    // OR basic login.
    // For "Production Ready" feel, let's require simple mock login or guest checkout.
    // I will use a hardcoded Guest User ID if not logged in or better:
    // I'll auto-create a guest booking. The backend requires User ID.
    // I'll fetch the first user (likely admin) to attach booking to, 
    // OR create a "Guest" user in seed.
    // For simplicity: I'll assume the user is "Guest" (I'll create a dummy user in seed or just use the admin ID).

    // Better: Simple input for Name/Email in form.
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    if (!showtime) return <div className="container section-padding">No booking details found.</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Register/Find user first (Simplified flow)
            let userId;
            try {
                const registerRes = await axios.post('http://localhost:5000/api/auth/register', {
                    username: name,
                    email: email,
                    password: 'password123' // Dummy password
                });
                // If success, login to get ID? Or just use a find?
                // Actually the register might fail if exists.
                // Let's try login if register fails.
            } catch (err) {
                // Ignore if user exists
            }

            // Login to get ID (Hack for demo without full Context Auth)
            const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
                email: email,
                password: 'password123'
            });
            userId = loginRes.data.user.id;

            const bookingData = {
                user_id: userId,
                showtime_id: showtime._id,
                seats: selectedSeats,
                total_price: totalPrice
            };

            await axios.post('http://localhost:5000/api/bookings', bookingData);
            navigate('/booking/confirmation', { state: { booking: bookingData } });
        } catch (err) {
            console.error(err);
            alert('Booking failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container section-padding fade-in booking-form-page">
            <h2 className="page-title">Confirm Booking</h2>

            <div className="booking-summary">
                <div className="summary-card">
                    <h3>Movie Details</h3>
                    <p><strong>Movie:</strong> {showtime.movie.title}</p>
                    <p><strong>Date:</strong> {new Date(showtime.date).toDateString()}</p>
                    <p><strong>Time:</strong> {showtime.time}</p>
                    <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                    <div className="total">
                        <span>Total Price:</span>
                        <span className="gold">{totalPrice} ETB</span>
                    </div>
                </div>

                <div className="form-card">
                    <h3>Guest Details</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Processing...' : 'Confirm & Pay'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
