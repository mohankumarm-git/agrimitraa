require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/crops', require('./src/routes/cropRoutes'));
app.use('/api/disease', require('./src/routes/diseaseRoutes'));
app.use('/api/voice', require('./src/routes/voiceRoutes'));
app.use('/api/mandi', require('./src/routes/mandiRoutes'));

// Define Routes
app.get('/health', (req, res) => res.status(200).json({ success: true, message: 'API is healthy' }));

// Error Handler (must be last)
app.use(errorHandler);

// Set Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
