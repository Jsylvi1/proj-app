//best
import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import EventList from './EventsList';
import './CalendarComponent.css';
import EventForm from './EventForm';
import Logout from './Logout';

const localizer = momentLocalizer(moment);


class CalendarComponent extends Component {
  state = {
    events: [],
    showWeekends: false 
  };

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = async () => {
    try {
      //const response = await axios.get('http://localhost:5000/api/events');
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/events`);
      const events = response.data.map(event => ({
        ...event,
        start: moment(event.start).format(), 
        end: moment(event.end).format() 
      }));
      this.setState({ events });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  handleDeleteEvent = (eventId) => {
    const updatedEvents = this.state.events.filter(event => event._id !== eventId);
    this.setState({ events: updatedEvents });
  };

  render() {
    return (
      <div className="calendar-container">
        <div className="sidebar">
          <h2>Active Schedules</h2>
          <ul>
            <EventList events={this.state.events} /> 
          </ul>
          <br></br>
          <br></br>
          <br></br>
          <Logout />
        </div>
        <div className="calendar-wrapper">
          <EventForm/>
          <Calendar
          localizer={localizer}
          events={this.state.events}
          startAccessor={(event) => { return new Date(event.start) }}
          endAccessor={(event) => { return new Date(event.end) }}   
          style={{ height: 650 }}
          views={['month', 'week', 'day']} 
          />
        </div>
      </div>
    );
  }
}

export default CalendarComponent;