//Test Email for when it all breaks
/*
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.OUTLOOK_EMAIL,
    pass: process.env.OUTLOOK_PASSWORD
  },
  secure: false,
  port: 587
});

const testEmail = async () => {
  try {
    await transporter.sendMail({
      from: process.env.OUTLOOK_EMAIL,
      to: 'jsylvi1@students.towson.edu',
      subject: 'Test Email',
      text: 'This is a test email from Nodemailer.'
    });
    console.log('Test email sent successfully.');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

testEmail();
*/

require('dotenv').config();
const nodemailer = require('nodemailer');
const ics = require('ics');
const Event = require('./models/event.model'); 


const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.OUTLOOK_EMAIL,
    pass: process.env.OUTLOOK_PASSWORD
  },
  secure: false, 
  port: 587
});


const generateICS = (schedulerEvent) => {
  const { name, selectedTime } = schedulerEvent;
  const start = new Date(selectedTime);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // Assuming 1-hour duration

const icsStart = (start) - '4';
const icsEnd = (end) - '4';

  const icsEvent = {
    start: icsStart,
    end: icsEnd,
    title: name || 'No Title',
    description: 'Training Event',
    location: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_YTczZTEyZTktMDg3NS00NjAwLWJhZGEtMTQwMmUzZjk2NGY5%40thread.v2/0?context=%7b%22Tid%22%3a%229fa4f438-b1e6-473b-803f-86f8aedf0dec%22%2c%22Oid%22%3a%2298858f0c-f024-4b30-a423-01da410e9bf4%22%7d',
    status: 'CONFIRMED'
  };

  const { error, value } = ics.createEvent(icsEvent);
  if (error) {
    console.error('Error creating ICS event:', error);
    return null;
  }
  return value;
};


const sendEmail = async (to, schedulerEventId) => {
  try {
    const event = await Event.findOne({ 'schedulerEvents._id': schedulerEventId }).populate('schedulerEvents');
    if (!event) {
      return { success: false, message: 'Event or scheduler event not found' };
    }

    const schedulerEvent = event.schedulerEvents.find(se => se._id.toString() === schedulerEventId);
    if (!schedulerEvent) {
      return { success: false, message: 'Scheduler event not found' };
    }

    const icsContent = generateICS(schedulerEvent);

    const emailBody = `
      Event Title: ${event.title}
      Scheduler Event Details:
      - Name: ${schedulerEvent.name}
      - Selected Time: ${new Date(schedulerEvent.selectedTime).toLocaleString('en-US', { timeZone: 'America/New_York' })}
    `;

    const mailOptions = {
      from: process.env.OUTLOOK_EMAIL,
      to,
      subject: 'Coaching Invite',
      text: emailBody,
      icalEvent: {
        filename: "invite.ics",
        //method: "request",
        content: icsContent,
      },
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.message };
  }
};

module.exports = sendEmail;

