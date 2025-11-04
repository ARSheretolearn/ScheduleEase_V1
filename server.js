require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB Connected');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// ✅ User Routes
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.send('SchedulEase Backend API Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
