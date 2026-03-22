const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json()); // Body parser
app.use(cookieParser()); // Cookie parser

// Route files
const auth = require('./routes/auth');
const prescription = require('./routes/prescription');
const millet = require('./routes/millet');
const recipe = require('./routes/recipe');
const expert = require('./routes/expert');
const ai = require('./routes/ai');
const healthLog = require('./routes/healthLog');
const admin = require('./routes/admin');

app.use('/api/auth', auth);
app.use('/api/prescription', prescription);
app.use('/api/millets', millet);
app.use('/api/recipes', recipe);
app.use('/api/experts', expert);
app.use('/api/ai', ai);
app.use('/api/health-logs', healthLog);
app.use('/api/admin', admin);

app.get('/', (req, res) => {
  res.send('MilletVerse API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
