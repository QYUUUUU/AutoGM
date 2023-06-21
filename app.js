import dotenv from 'dotenv';
import express, { static as expressStatic } from 'express';
import helmet from 'helmet';
import userRoutes from './routes/userRoutes.js';
import backendRoutes from './routes/backendRoutes.js';
import authRoutes from './routes/authRoutes.js';
import expressSession from 'express-session';
import { PrismaClient } from '@prisma/client';

import { PrismaSessionStore } from '@quixo3/prisma-session-store';


dotenv.config({ path: `.env.local`, override: true });

const app = express();
app.use(helmet());

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

app.use(expressStatic('public'));
app.use('/public', expressStatic('public'));
app.use('/Documentation', expressStatic('Documentation'));
app.use('/auth', authRoutes); // Add this line for authentication routes
app.use('/', userRoutes);
app.use('/backend', backendRoutes);

app.listen(80, () => {
  console.log('Server started on port 80');
});