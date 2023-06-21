import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Register a new user
router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Perform form validation
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).render('../views/register.html.twig', { error: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        firstname,
        lastname,
        email,
        password: hashedPassword,
      },
    });

    // Create a session for the user
    req.session.userId = user.id;

    res.redirect('/');

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).render('../views/register.html.twig', { error: 'Failed to register user' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Perform form validation
  if (!email || !password) {
    return res.status(400).render('../views/login.html.twig', { error: 'Email and password are required' });
  }

  try {
    // Retrieve the user from the database
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).render('../views/login.html.twig', { error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).render('../views/login.html.twig', { error: 'Invalid credentials' });
    }

    // Create a session for the user
    req.session.userId = user.id;

    res.redirect('/');

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).render('../views/login.html.twig', { error: 'Failed to log in' });
  }
});

export default router;