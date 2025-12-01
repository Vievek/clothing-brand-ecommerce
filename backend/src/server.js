import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

// Load env vars
dotenv.config();

// Connect to database ONLY if not in test environment
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// CORS configuration - adjust for test environment
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Handle undefined routes
app.use((_req, res) => {
  const NOT_FOUND_STATUS = 404;
  res.status(NOT_FOUND_STATUS).json({
    status: 'fail',
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

const DEFAULT_PORT = 5000;
const PORT = process.env.PORT || DEFAULT_PORT;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    // Use allowed console methods only
    console.warn(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}

export default app;
