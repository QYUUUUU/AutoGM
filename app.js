import dotenv from 'dotenv';
import express, { static as expressStatic } from 'express';

// Import routes
import userRoutes from './routes/userRoutes.js';
import backendRoutes from './routes/backendRoutes.js';

// Load environment variables from .env.local
dotenv.config({ path: `.env.local`, override: true });

// Create express app
const app = express();

// Use routes
app.use(expressStatic('public'));
app.use('/public', expressStatic('public'));
app.use('/Documentation', expressStatic('Documentation'));
app.use('/', userRoutes);
app.use('/backend', backendRoutes);


// Start server
app.listen(3000, () => {
console.log('Server started on port 3000');
});