import dotenv from 'dotenv';
import express, { static as expressStatic } from 'express';
import userRoutes from './app/routes/userRoutes.js';
import backendRoutes from './app/routes/backendRoutes.js';
import authRoutes from './app/routes/authRoutes.js';
import adminRoutes from './app/routes/adminRoutes.js';
import expressSession from 'express-session';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
dotenv.config({ path: `.env.local`, override: true });

const app = express();

//APPLICATION ROUTES

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
      new PrismaClient(),
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', "./app/views");

app.use(expressStatic('./app/public'));
app.use('/public', expressStatic('./app/public'));
app.use('/Documentation', expressStatic('Documentation'));
app.use('/auth', authRoutes); // Add this line for authentication routes
app.use('/', userRoutes);
app.use('/backend', backendRoutes);
app.use('/admin', adminRoutes);

app.listen(80, () => {
  console.log('Server started on port 80');
});
