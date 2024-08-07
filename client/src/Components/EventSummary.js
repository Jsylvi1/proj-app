
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventSummary = ({ _id, title, start, end, onDelete }) => {
  
  const notify = () => toast("Event Deleted! Refresh the page.");

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${_id}`);
      onDelete(_id); 
    } catch (error) {
      console.error('Error deleting event:', error);
    }
    notify();
  };

  return (
    <div className="event-summary">
      <Link to={`/events/${_id}`}>
        {title}
      </Link>
      <p><strong>Start:</strong> {start}</p>
      <p><strong>End:</strong> {end}</p>
      <button onClick={handleDelete}>Delete</button>
      <ToastContainer />
    </div>
  );
}

export default EventSummary;