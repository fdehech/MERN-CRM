import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import clientRoutes from './routes/clientRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ScamCRM API is running' });
});

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api', noteRoutes);
app.use('/api', transactionRoutes);
app.use('/api', appointmentRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`💚 Health check at http://localhost:${PORT}/health`);
});

export default app;
