import React from 'react';
import ReactDOM from 'react-dom';
import "../assets/review.css";

const ReviewsModel = ({ children, onClose }) => {
    return ReactDOM.createPortal(
        <div className="aios-portal-overlay">
            <div className="aios-portal-content">
                <button className="aios-portal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default ReviewsModel;
