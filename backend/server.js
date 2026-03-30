const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Trust proxy for Render/Heroku/Vercel environments
app.set('trust proxy', 1);

// Security and Optimization Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Temporarily disabled if relying on external CDN scripts/images
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
}

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 200, // Increased slightly to avoid blocking standard usage patterns initially
  message: 'Too many requests from this IP, please try again in 15 minutes',
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

// In production, we don't serve static files here because Frontend is on Vercel.
// But we keep the health check.
app.get('/', (req, res) => {
  res.send('MilletVerse API is running securely...');
});

// Global Error Handlers must be at the end
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
