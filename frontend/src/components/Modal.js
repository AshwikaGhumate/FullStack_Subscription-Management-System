import React from 'react';
import './Modal.css'; // Import the CSS file for styling the modal

// Modal component to display content inside a modal window
const Modal = ({ children, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}> {/* Overlay background, closes modal on click */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}> {/* Stops click from closing modal */}
                <button className="modal-close" onClick={onClose}>&times;</button> {/* Close button */}
                {children} {/* Modal content passed as children */}
            </div>
        </div>
    );
};

export default Modal;
