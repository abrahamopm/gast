import React, { useEffect } from 'react';
import './Notification.css';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success': return <FaCheckCircle />;
            case 'error': return <FaExclamationCircle />;
            default: return <FaInfoCircle />;
        }
    };

    return (
        <div className={`notification notification-${type} slide-in`}>
            <div className="notification-icon">{getIcon()}</div>
            <div className="notification-message">{message}</div>
            <button className="notification-close" onClick={onClose}>
                <FaTimes />
            </button>
        </div>
    );
};

export default Notification;
