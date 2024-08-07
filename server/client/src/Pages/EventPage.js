
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
//import 'react-big-calendar/lib/css/react-big-calendar.css';
import './EventPage.css'; 
import Modal from '../Components/Modal';
import EmailModal from '../Components/EmailModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const localizer = momentLocalizer(moment);

const noticeEmail = () => toast("Email Sent!");
const noticeUnavail = () => toast("This time slot is unavailable");

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [schedulerEventId, setSchedulerEventId] = useState(null);
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Error fetching event. Please try again later.');
        setLoading(false);
      }
    };

    const fetchUnavailableSlots = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        const allEvents = response.data;

        const blockedSlots = allEvents.flatMap(event =>
          event.schedulerEvents.map(existingEvent => ({
            start: new Date(existingEvent.selectedTime),
            end: moment(new Date(existingEvent.selectedTime)).add(1, 'hour').toDate()
          }))
        );

        setUnavailableSlots(blockedSlots);
      } catch (error) {
        console.error('Error fetching unavailable slots:', error);
      }
    };

    fetchEvent();
    fetchUnavailableSlots();
  }, [eventId]);

  const handleSlotSelect = (slotInfo) => {
    const { start } = slotInfo;
    const now = new Date();

    if (start < now) {
      alert('Cannot schedule an event in the past.');
      return;
    }

    const isUnavailable = unavailableSlots.some(slot =>
      start >= slot.start && start < slot.end
    );

    if (isUnavailable) {
      noticeUnavail();
      return;
    }

    setSelectedTime(start);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTime(null);
    setSchedulerEventId(null);
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setSchedulerEventId(null);
  };

  /*
  const handleSave = async (name) => {
    const newStart = selectedTime;
    const newEnd = moment(selectedTime).add(1, 'hour').toDate(); 

    const isOverlap = event.schedulerEvents.some(existingEvent => {
      const existingStart = new Date(existingEvent.selectedTime);
      const existingEnd = moment(existingStart).add(1, 'hour').toDate();
      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (isOverlap) {
      alert('This event overlaps with an existing event.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/events/addToSchedulerEvents/${eventId}`, {
        name,
        selectedTime: newStart.toISOString(),
      });

      setEvent(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding scheduler event:', error);
    }
  };
  */

  const handleSave = async (name) => {
    const newStart = selectedTime;
    const newEnd = moment(selectedTime).add(1, 'hour').toDate(); 
  
    const isOverlap = event.schedulerEvents.some(existingEvent => {
      const existingStart = new Date(existingEvent.selectedTime);
      const existingEnd = moment(existingStart).add(1, 'hour').toDate();
      return (newStart < existingEnd && newEnd > existingStart);
    });
  
    if (isOverlap) {
      alert('This event overlaps with an existing event.');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:5000/api/events/addToSchedulerEvents/${eventId}`, {
        name,
        selectedTime: newStart.toISOString(),
        timezone: 'EST' 
      });
  
      setEvent(response.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding scheduler event:', error);
    }
  };
  

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/events/schedulerEvents/${eventId}/${schedulerEventId}`);
      
      setEvent(prevEvent => ({
        ...prevEvent,
        schedulerEvents: prevEvent.schedulerEvents.filter(event => event._id !== schedulerEventId),
      }));
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting scheduler event:', error);
    }
  };

  const handleSendEmail = async (email) => {
    if (!schedulerEventId) {
      alert('No scheduler event selected.');
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:5000/api/events/sendEmail/${eventId}/${schedulerEventId}`, {
        email
      });
  
      if (response.status === 200) {
       noticeEmail();
       handleCloseEmailModal(); 
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>No event found.</div>;

  const schedulerEvents = event.schedulerEvents || [];

  const events = schedulerEvents.map(({ _id, name, selectedTime }) => ({
    id: _id,
    title: name,
    start: new Date(selectedTime),
    end: moment(selectedTime).add(1, 'hour').toDate(),
  }));

  const eventStartDate = moment(event.start).format('MMM D, YYYY');
  const eventEndDate = moment(event.end).format('MMM D, YYYY');

  return (
    <div className="event-page">
      <h2>Event: {event.title} ({eventStartDate} - {eventEndDate})</h2>
      <div style={{ height: 900, width: 1300, padding: 40 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSlotSelect}
          views={['work_week']}
          defaultView="work_week"
          defaultDate={new Date(event.start)}
          dayLayoutAlgorithm="no-overlap"
          min={new Date().setHours(8, 0, 0)}
          max={new Date().setHours(17, 0, 0)}
          components={{
            event: ({ event }) => (
              <div>
                <span>{event.title}</span>
                <br />
                <button onClick={() => {
                  setSchedulerEventId(event.id);
                  setShowModal(true);
                }}>Delete</button>
                <br />
                <button onClick={() => {
                  setSchedulerEventId(event.id);
                  setShowEmailModal(true);
                }}>Invite</button>
              </div>
            ),
            timeSlotWrapper: ({ children, value }) => {
              const isBlocked = unavailableSlots.some(slot =>
                value >= slot.start && value < slot.end
              );
              return (
                <div className={isBlocked ? 'blocked-slot' : ''}>
                  {children}
                </div>
              );
            }
          }}
        />
      </div>
      <Modal
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        onDelete={handleDelete}
        schedulerEventId={schedulerEventId}
      />
      <EmailModal
        show={showEmailModal}
        onClose={handleCloseEmailModal}
        onSendEmail={handleSendEmail}
        schedulerEventId={schedulerEventId}
        eventTitle={event.title}
      />
      <ToastContainer />
    </div>
  );
};

export default EventPage;
