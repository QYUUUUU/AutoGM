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
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


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

app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.disable('x-powered-by');

app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net",
          (req, res) => `'nonce-${res.locals.cspNonce}'`
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://maxcdn.bootstrapcdn.com",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com"

        ],

        fontSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com",
          "https://maxcdn.bootstrapcdn.com",
          "data:"
        ],

        imgSrc: [
          "'self'",
          "data:",
          "blob:"
        ],

        connectSrc: [
          "'self'"
        ],

        objectSrc: ["'none'"],

        baseUri: ["'self'"],

        frameAncestors: ["'self'"]
      }
    }
  })
);

app.use(express.json({
  limit: '4mb'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '100kb'
}));


// Explicit route for the favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

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
  const role = req.session?.role;

  res.locals.isAdmin = role === 'admin';

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