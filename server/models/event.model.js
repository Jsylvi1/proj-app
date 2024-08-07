/*
const mongoose = require('mongoose');

const SchedulerEventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  selectedTime: { type: Date, required: true }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  schedulerEvents: [{ name: String, selectedTime: Date }]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
*/

const mongoose = require('mongoose');

const SchedulerEventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  selectedTime: { type: Date, required: true }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  schedulerEvents: [SchedulerEventSchema]
});

EventSchema.index({ start: 1 });
EventSchema.index({ end: 1 });

EventSchema.pre('save', function (next) {
  if (this.start >= this.end) {
    return next(new Error('End time must be after start time'));
  }
  next();
});

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
