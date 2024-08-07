
import React, { useState } from 'react';

const EmailModal = ({ show, onClose, onSendEmail, schedulerEventId, eventTitle }) => {
  const [email, setEmail] = useState('');


  const handleSend = () => {
    onSendEmail(email);
  };  

  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Send Email</h2>
        <form>
          <div>
            <label>Recipient Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={handleSend}>Send</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
