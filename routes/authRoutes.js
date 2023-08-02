import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

import DiscordOauth2 from "discord-oauth2";
const oauth = new DiscordOauth2();

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


// Login a user
router.get('/discord', async (req, res) => {
  if (req.session.userId != "undefined" && req.session.userId != ""  && req.session.userId != null){
    const userId = req.session.userId;
    const prisma = new PrismaClient();

    try {
      const code=req.query.code;
      const params = new URLSearchParams();
      params.append('client_id', "1136201492995518515");
      params.append('client_secret', "_EAUMf2RaYQa3py7-A0GK8dEhQrMze1d");
      params.append('grant_type', 'authorization_code');
      params.append('redirect_uri', "http://localhost/auth/discord");
      params.append('scope', 'identify');
      params.append('code', code);

      const requestOptions = {
        method: "POST",
        body: params,
      };

      fetch('https://discord.com/api/oauth2/token', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          axios.get("https://discord.com/api/users/@me", make_config(data.access_token))
            .then(async response => {
            console.log(response.data.id);
            const updatedUser = await prisma.user.update({
              where: { id: userId },
              data: { discordId: response.data.id },
            });
            res.redirect('/');
            })
            .catch(err => {
              console.log(err);
              res.sendStatus(500);
            });
        });

    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).render('../views/login.html.twig', { error: 'Failed to log in' });
    }
  }else{
    res.redirect('/login');
  }
});


function make_config(authorization_token) { // Define the function
  var data = { // Define "data"
    headers: { // Define "headers" of "data"
      "authorization": `Bearer ${authorization_token}` // Define the authorization
    }
  };
  return data; // Return the created object
};

export default router;
