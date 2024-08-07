
import React, { Component } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import moment from 'moment-timezone';
import './EventForm.css';
import 'react-toastify/dist/ReactToastify.css';

const notify = () => toast("Event Added! Refresh the Page.");

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      start: '',
      end: '',
      schedulerEvents: []
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const { title, start, end, schedulerEvents } = this.state;

    const timezone = moment.tz.guess();
    const localStart = moment.tz(start, timezone).startOf('day').toISOString();
    const localEnd = moment.tz(end, timezone).endOf('day').toISOString();

    try {
      const response = await axios.post('http://localhost:5000/api/events/add', {
        title,
        start: localStart,
        end: localEnd,
        schedulerEvents
      });

      console.log(response.data); 

      this.setState({
        title: '',
        start: '',
        end: '',
        schedulerEvents: [] 
      });

      notify(); 
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  render() {
    return (
      <div className="event-form-container">
        <h2>Add New Event</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date" 
              name="start"
              value={this.state.start}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date" 
              name="end"
              value={this.state.end}
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit">Add Event</button>
          <ToastContainer />
        </form>
      </div>
    );
  }
}

export default EventForm;
