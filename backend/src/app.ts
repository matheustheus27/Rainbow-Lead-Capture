import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import customerRoutes from './routes/customerRoutes';
import authRoutes from './routes/authRoutes';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Structured HTTP Request Logger Middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    // Don't clutter with high-frequency healthchecks in standard logs unless error
    if (req.path === '/health' && res.statusCode === 200) return;

    const logData = {
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip || req.socket.remoteAddress,
    };

    if (res.statusCode >= 500) {
      logger.error('HttpRequest', 'Internal server error processing request', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HttpRequest', 'Client error request', logData);
    } else {
      logger.info('HttpRequest', 'HTTP request processed', logData);
    }
  });
  next();
});

// Healthcheck Route
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes - both with and without /api prefix for robust reverse-proxy compatibility
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);
app.use('/api', customerRoutes);
app.use('/', customerRoutes);

// Global 404 Handler
app.use((req, res) => {
  logger.warn('Router', 'Route not found', { path: req.originalUrl, method: req.method });
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Initialize Database & Start Server
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      logger.info('Server', 'IrisCRM Backend active and running', {
        port: PORT,
        nodeEnv: process.env.NODE_ENV || 'development',
      });
    });
  } catch (error) {
    logger.error('Server', 'Failed to initialize database on startup', {}, error);
    // Start server in degraded mode to keep container running for healthchecks
    app.listen(PORT, () => {
      logger.warn('Server', 'IrisCRM Backend running in degraded mode', { port: PORT });
    });
  }
};

startServer();

export default app;
