import React, { useEffect } from 'react';
import './Toast.css';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

function Toast({ message, type = 'info', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle size={20} />;
            case 'error':
                return <AlertCircle size={20} />;
            default:
                return <Info size={20} />;
        }
    };

    return (
        <div className={`toast toast--${type}`}>
            <div className="toast__icon">
                {getIcon()}
            </div>
            <p className="toast__message">{message}</p>
            <button className="toast__close" onClick={onClose}>
                <X size={18} />
            </button>
        </div>
    );
}

export default Toast;
