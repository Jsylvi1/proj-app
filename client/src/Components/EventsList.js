
import React from 'react';
import EventSummary from './EventSummary';

const EventList = ({ events }) => (

  <React.Fragment>
    <div className="container">
      <div className="event-list">
        <h2>All Events</h2>
        <div>
          {events.map(event => (
            <EventSummary key={event._id} {...event} />
          ))}
        </div>
      </div>
    </div>
  </React.Fragment>

);

export default EventList;
