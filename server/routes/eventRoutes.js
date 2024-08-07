
require('dotenv').config();
const express = require('express');
const router = express.Router();
const Event = require('../models/event.model'); 
const sendEmail = require('../emailService');
const moment = require ('moment');

// Add a new event
router.post('/add', async (req, res) => {
  const { title, start, end, schedulerEvents } = req.body;

  const newEvent = new Event({
    title,
    start,
    end,
    schedulerEvents: [],
  });

  try {
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET ALL events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE event by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted', deletedEvent });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADD to event array
router.post('/addToSchedulerEvents/:id', async (req, res) => {
  const { id } = req.params;
  const { name, selectedTime } = req.body; 

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    //const newStart = moment(selectedTime);
    const newEnd = selectedTime + '1';

    const isOverlap = event.schedulerEvents.some(existingEvent => {
      const existingStart = moment(existingEvent.selectedTime);
      const existingEnd = moment(existingStart).add(1, 'hour').toDate(); 
      return selectedTime < existingEnd && newEnd > existingStart;
    });

    if (isOverlap) return res.status(400).send('Event overlaps with an existing event.');

    event.schedulerEvents.push({ name, selectedTime });
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    console.error('Error adding scheduler event:', error);
    res.status(500).send('Server error');
  }
});

// DELETE scheduler event by ID
router.delete('/schedulerEvents/:eventId/:schedulerEventId', async (req, res) => {
  const { eventId, schedulerEventId } = req.params;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { schedulerEvents: { _id: schedulerEventId } } },
      { new: true } 
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Scheduler event deleted', updatedEvent });
  } catch (error) {
    console.error('Error deleting scheduler event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET a specific event by ID
router.get('/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId).populate('schedulerEvents');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// SEND email
router.post('/sendEmail/:eventId/:schedulerEventId', async (req, res) => {
  const { eventId, schedulerEventId } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email required' });
  }

  try {
    const event = await Event.findById(eventId).populate('schedulerEvents');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const schedulerEvent = event.schedulerEvents.find(se => se._id.toString() === schedulerEventId);
    if (!schedulerEvent) {
      return res.status(404).json({ message: 'Scheduler event not found' });
    }

    const result = await sendEmail(email, schedulerEventId);
    if (result.success) {
      res.status(200).json({ message: 'Email sent successfully!' });
    } else {
      res.status(500).json({ message: result.message });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

module.exports = router;
