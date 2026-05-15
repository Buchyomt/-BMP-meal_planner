import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/db.js';

// Load env vars
dotenv.config();

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import pantryRoutes from './routes/pantryRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import shoppingListRoutes from './routes/shoppingListRoutes.js';

export const app = express();

// Ensure database connection for serverless environments
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error('Database connection failed:', error);
      res.status(500).json({ message: 'Database connection failed' });
    }
  } else {
    console.warn('WARNING: MONGODB_URI not found in .env. Database connection skipped.');
    next();
  }
});

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS
app.use(cors());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/meals', mealPlanRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/shopping-list', shoppingListRoutes);

// Basic route for API
app.get('/api/health', (req, res) => {
  res.json({ status: 'BMP API is running...' });
});

// Add production static serving
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/dist')));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    }
  });
}

const PORT = process.env.PORT || 5000;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app;
