import React from 'react';

function Modal({ isOpen, onRequestClose, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                {children}
                <button onClick={onRequestClose}>Close</button>
            </div>
        </div>
    );
}

export default Modal;