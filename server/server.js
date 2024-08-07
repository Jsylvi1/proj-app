
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/events', eventRoutes);

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

//mongoose.connect('mongodb+srv://jsylvi1:8WRIVoTDD7Zo4u0F@cluster1.buyyios.mongodb.net/', {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
/*
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
*/
app.listen(process.env.PORT || 80, '0.0.0.0');
