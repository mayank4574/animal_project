const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin:
      corsOrigin === '*'
        ? '*'
        : corsOrigin && corsOrigin.includes(',')
        ? corsOrigin.split(',').map((s) => s.trim())
        : corsOrigin || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date() });
});

// Routes
app.use('/api/providers', require('./routes/providerRoutes'));
app.use('/api/business-listings', require('./routes/businessListingRoutes'));
app.use('/api/corrections', require('./routes/correctionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
