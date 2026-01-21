import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SeatSelection.css';

const SeatSelection = () => {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        const fetchShowtime = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/showtimes/${showtimeId}`);
                setShowtime(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchShowtime();
    }, [showtimeId]);

    const toggleSeat = (seat) => {
        if (seat.status === 'booked') return;

        if (selectedSeats.includes(seat.id)) {
            setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
        } else {
            setSelectedSeats([...selectedSeats, seat.id]);
        }
    };

    const handleProceed = () => {
        navigate('/booking/form', {
            state: {
                showtime,
                selectedSeats,
                totalPrice: selectedSeats.length * showtime.price
            }
        });
    };

    if (!showtime) return <div className="loading">Loading...</div>;

    // Group seats by row (A, B, C...)
    const rows = {};
    showtime.seats.forEach(seat => {
        const row = seat.id.charAt(0);
        if (!rows[row]) rows[row] = [];
        rows[row].push(seat);
    });

    return (
        <div className="container section-padding fade-in">
            <h2 className="page-title">Select Seats</h2>
            <div className="screen-container">
                <div className="screen">SCREEN</div>
            </div>

            <div className="seat-grid">
                {Object.keys(rows).map(rowLabel => (
                    <div key={rowLabel} className="seat-row">
                        <span className="row-label">{rowLabel}</span>
                        {rows[rowLabel].map(seat => (
                            <div
                                key={seat.id}
                                className={`seat ${seat.status} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                                onClick={() => toggleSeat(seat)}
                            >
                                {seat.id.substring(1)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="legend">
                <div className="legend-item"><div className="seat available"></div> Available</div>
                <div className="legend-item"><div className="seat selected"></div> Selected</div>
                <div className="legend-item"><div className="seat booked"></div> Booked</div>
            </div>

            <div className="booking-actions">
                <div className="price-info">
                    <span className="label">Total Price:</span>
                    <span className="amount">{selectedSeats.length * showtime.price} ETB</span>
                </div>
                <button
                    className="btn-primary"
                    disabled={selectedSeats.length === 0}
                    onClick={handleProceed}
                >
                    Proceed to Book
                </button>
            </div>
        </div>
    );
};

export default SeatSelection;
