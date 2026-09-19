import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MockForge API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to MockForge API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      health: '/api/health'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎨 MockForge Backend Server                             ║
║                                                           ║
║   ✅ Server running on port ${PORT}                        ║
║   📡 Environment: ${process.env.NODE_ENV || 'development'}                        ║
║   🔗 API: http://localhost:${PORT}/api                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Error: ${err.message}`);
  server.close(() => process.exit(1));
});

export default app;
