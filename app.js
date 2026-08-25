import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import expressSession from 'express-session';

import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import userRoutes from './app/routes/userRoutes.js';
import backendRoutes from './app/routes/backendRoutes.js';
import authRoutes from './app/routes/authRoutes.js';
import adminRoutes from './app/routes/adminRoutes.js';
import eclatsRoutes from './app/routes/eclatsRoutes.js';

import fs from 'node:fs';

function loadSecret(name) {
  const path = `/run/secrets/${name}`;

  if (fs.existsSync(path)) {
    return fs.readFileSync(path, 'utf8').trim();
  }

  return process.env[name.toUpperCase()];
}

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

if (process.env.NODE_ENV === 'production') {
  process.env.DATABASE_URL = loadSecret('database_url');
  process.env.SESSION_SECRET = loadSecret('session_secret');
  process.env.JWT_SECRET = loadSecret('jwt_secret');
  process.env.OPENAI_API_KEY = loadSecret('openai_api_key');
}


const app = express();
const prisma = new PrismaClient();

app.disable('x-powered-by');

app.set('trust proxy', 1);

app.use(helmet());

app.use(express.json({
  limit: '1mb'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '100kb'
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Please try again later.'
  }
});

app.use(
  expressSession({
    name: 'sid',
    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    },

    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true
    })
  })
);

app.set('views', './app/views');

app.use((req, res, next) => {
  res.locals.isAdmin = req.session?.userId === 1;
  next();
});

app.use(express.static('./app/public'));

app.use('/auth', authLimiter, authRoutes);
app.use('/', userRoutes);
app.use('/backend', backendRoutes);
app.use('/admin', adminRoutes);
app.use('/eclats', eclatsRoutes);

app.use((req, res) => {
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: 'Internal server error'
  });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});