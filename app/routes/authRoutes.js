import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prisma/prismaClient.js';

const router = Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { pseudo, email, password } = req.body;

  if (!pseudo || !email || !password) {
    return res.status(400).render('../views/register.html.twig', {
      error: 'All fields are required'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        pseudo,
        email,
        password: hashedPassword,
        role: 'user'
      }
    });

    req.session.userId = user.id;
    req.session.role = user.role;

    res.redirect('/');

  } catch (error) {
    console.error('Error registering user:', error);

    res.status(500).render('../views/register.html.twig', {
      error: 'Failed to register user'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render('../views/login.html.twig', {
      error: 'Email and password are required'
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).render('../views/login.html.twig', {
        error: 'Invalid credentials'
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).render('../views/login.html.twig', {
        error: 'Invalid credentials'
      });
    }

    // Store the authorization information in the session.
    // No DB lookup is needed on subsequent requests.
    req.session.userId = user.id;
    req.session.role = user.role;

    console.log(
      `User ${user.id} logged in with role ${user.role}`
    );

    res.redirect('/');

  } catch (error) {
    console.error('Error logging in:', error);

    res.status(500).render('../views/login.html.twig', {
      error: 'Failed to log in'
    });
  }
});

export default router;