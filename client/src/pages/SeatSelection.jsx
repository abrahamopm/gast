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

    const isVip = (row) => ['A', 'B'].includes(row);
    const getSeatPrice = (row) => isVip(row) ? showtime.price * 1.5 : showtime.price;

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seatId) => {
            const row = seatId.charAt(0);
            return total + getSeatPrice(row);
        }, 0);
    };

    const handleProceed = () => {
        navigate('/booking/form', {
            state: {
                showtime,
                selectedSeats,
                totalPrice: calculateTotal()
            }
        });
    };

    if (!showtime) return <div className="loading">Loading...</div>;

    const rows = {};
    showtime.seats.forEach(seat => {
        const row = seat.id.charAt(0);
        if (!rows[row]) rows[row] = [];
        rows[row].push(seat);
    });

    const selectedVipCount = selectedSeats.filter(id => isVip(id.charAt(0))).length;
    const selectedStandardCount = selectedSeats.length - selectedVipCount;

    return (
        <div className="container section-padding fade-in">
            <h2 className="page-title">Select Your Experience</h2>
            <div className="screen-container">
                <div className="screen">CINEMA SCREEN</div>
            </div>

            <div className="seat-grid">
                {Object.keys(rows).map(rowLabel => (
                    <div key={rowLabel} className="seat-row">
                        <span className="row-label">{rowLabel}</span>
                        {rows[rowLabel].map(seat => (
                            <div
                                key={seat.id}
                                className={`seat ${seat.status} ${isVip(rowLabel) ? 'vip' : ''} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                                onClick={() => toggleSeat(seat)}
                                title={`${isVip(rowLabel) ? 'VIP' : 'Standard'} - ${getSeatPrice(rowLabel)} ETB`}
                            >
                                {seat.id.substring(1)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="legend">
                <div className="legend-item"><div className="seat available"></div> Basic</div>
                <div className="legend-item"><div className="seat available vip"></div> VIP</div>
                <div className="legend-item"><div className="seat selected"></div> Selected</div>
                <div className="legend-item"><div className="seat booked"></div> Booked</div>
            </div>

            <div className="booking-actions">
                <div className="price-breakdown">
                    {selectedVipCount > 0 && (
                        <div className="price-item fade-in">
                            <span className="price-label">{selectedVipCount} VIP</span>
                            <span className="price-value">{selectedVipCount * showtime.price * 1.5} ETB</span>
                        </div>
                    )}
                    {selectedStandardCount > 0 && (
                        <div className="price-item fade-in">
                            <span className="price-label">{selectedStandardCount} Standard</span>
                            <span className="price-value">{selectedStandardCount * showtime.price} ETB</span>
                        </div>
                    )}
                </div>

                <div className="total-price">
                    <span className="total-label">TOTAL</span>
                    <span className="total-amount">{calculateTotal()} ETB</span>
                </div>

                <button
                    className="btn-primary"
                    disabled={selectedSeats.length === 0}
                    onClick={handleProceed}
                >
                    Confirm Selection
                </button>
            </div>
        </div>
    );
};

export default SeatSelection;
