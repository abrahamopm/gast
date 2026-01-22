import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './BookingForm.css';
import { useNotification } from '../context/NotificationContext';
import { FaMobileAlt, FaWallet, FaMoneyBillWave } from 'react-icons/fa';

const BookingForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showtime, selectedSeats, totalPrice } = location.state || {};
    const [submitting, setSubmitting] = useState(false);
    const { addNotification } = useNotification();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [phone, setPhone] = useState('');

    if (!showtime) return <div className="container section-padding">No booking details found.</div>;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentMethod) {
            addNotification('Please select a payment method.', 'error');
            return;
        }

        setSubmitting(true);
        try {
            // Register/Find user (Simulated)
            let userId;
            try {
                // Try simple login first to check existence (hacky for demo)
                await axios.post('http://localhost:5000/api/auth/login', { email, password: 'password123' });
            } catch (err) {
                // If login fails, try register
                await axios.post('http://localhost:5000/api/auth/register', {
                    username: name,
                    email: email,
                    password: 'password123'
                });
            }

            // Always login to get fresh ID
            const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
                email: email,
                password: 'password123'
            });
            userId = loginRes.data.user.id;

            const bookingData = {
                user_id: userId,
                showtime_id: showtime._id,
                seats: selectedSeats,
                total_price: totalPrice,
                payment_method: paymentMethod
            };

            await axios.post('http://localhost:5000/api/bookings', bookingData);

            addNotification('Booking confirmed successfully!', 'success');
            navigate('/confirmation', { state: { booking: bookingData } });
        } catch (err) {
            console.error(err);
            addNotification('Booking failed. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const paymentMethods = [
        { id: 'telebirr', name: 'Telebirr', icon: <FaMobileAlt />, color: '#00a4e4' },
        { id: 'cbebirr', name: 'CBEBirr', icon: <FaWallet />, color: '#f7941d' },
        { id: 'mpesa', name: 'M-Pesa', icon: <FaMoneyBillWave />, color: '#3bb54a' }
    ];

    return (
        <div className="container section-padding fade-in booking-form-page">
            <h2 className="page-title">Finalize Your Experience</h2>

            <div className="booking-summary">
                <div className="summary-card">
                    <h3>Booking Summary</h3>
                    <p><strong>Movie</strong> <span>{showtime.movie.title}</span></p>
                    <p><strong>Date</strong> <span>{new Date(showtime.date).toDateString()}</span></p>
                    <p><strong>Time</strong> <span>{showtime.time}</span></p>
                    <p><strong>Seats</strong> <span>{selectedSeats.join(', ')}</span></p>
                    <div className="total">
                        <span>Total Due</span>
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
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="payment-section">
                            <h4>Select Payment Method</h4>
                            <div className="payment-options">
                                {paymentMethods.map(method => (
                                    <div
                                        key={method.id}
                                        className={`payment-card ${method.id} ${paymentMethod === method.id ? 'selected' : ''}`}
                                        onClick={() => setPaymentMethod(method.id)}
                                    >
                                        <div className="payment-icon" style={{ color: paymentMethod === method.id ? method.color : 'inherit' }}>
                                            {method.icon}
                                        </div>
                                        <div className="payment-name">{method.name}</div>
                                    </div>
                                ))}
                            </div>

                            {paymentMethod && (
                                <div className="form-group slide-up">
                                    <label>{paymentMethod} Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="09..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        <button type="submit" className="pay-button" disabled={submitting}>
                            {submitting ? 'Processing Payment...' : `Pay ${totalPrice} ETB`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
