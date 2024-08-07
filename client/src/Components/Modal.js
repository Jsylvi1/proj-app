import React, { useState } from 'react';
import './Modal.css'; 

const Modal = ({ show, onClose, onSave, onDelete, schedulerEventId }) => {
  const [name, setName] = useState('');

  const handleNameChange = (e) => setName(e.target.value);

  const handleSubmit = () => {
    if (name.trim()) {
      onSave(name);
      setName(''); 
    }
  };

  const handleDelete = () => {
    if (schedulerEventId) {
      onDelete(schedulerEventId); 
    }
  };

  if (!show) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {schedulerEventId ? (
          <div>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this scheduler event?</p>
            <button onClick={handleDelete} className="delete-button">Delete</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        ) : (
          <div>
            <h2>Enter Your Name and Role</h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
            />
            <button onClick={handleSubmit}>Save</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
