import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle, FaTicketAlt } from 'react-icons/fa';
import './Confirmation.css';

const Confirmation = () => {
    const location = useLocation();
    const { booking } = location.state || {};

    if (!booking) return (
        <div className="container section-padding confirmation-page">
            <p>No booking information found.</p>
            <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
    );

    return (
        <div className="container section-padding confirmation-page fade-in">
            <div className="success-icon">
                <FaCheckCircle />
            </div>
            <h2>Booking Confirmed!</h2>
            <p className="subtitle">Your tickets have been successfully booked.</p>

            <div className="ticket-card">
                <div className="ticket-header">
                    <FaTicketAlt /> Gast Cinema Ticket
                </div>
                <div className="ticket-body">
                    <div className="ticket-row">
                        <span className="label">Booking ID:</span>
                        <span className="value">{booking._id || 'PENDING...'}</span>
                    </div>
                    {/* Note: booking object might not have populated showtime details if returned directly from POST. 
                        In a real app, we might need to fetch it or pass details along. 
                        For now, we rely on what we have or just show basics. 
                    */}
                    <div className="ticket-row">
                        <span className="label">Amount Paid:</span>
                        <span className="value">{booking.total_price || booking.totalPrice} ETB</span>
                    </div>
                    <div className="ticket-row">
                        <span className="label">Seats:</span>
                        <span className="value">{booking.seats.join(', ')}</span>
                    </div>
                </div>
                <div className="ticket-footer">
                    Please show this ticket at the entrance.
                </div>
            </div>

            <div className="actions">
                <Link to="/dashboard" className="btn-outline">View My Bookings</Link>
                <Link to="/" className="btn-primary">Book Another Movie</Link>
            </div>
        </div>
    );
};

export default Confirmation;
