import dotenv from 'dotenv';
import express, { static as expressStatic } from 'express';
import userRoutes from './routes/userRoutes.js';
import backendRoutes from './routes/backendRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import expressSession from 'express-session';
import { PrismaClient } from '@prisma/client';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';


import { startMain as mainAgent } from "./agents/mainAgent.js";

import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        // ...
    ]
});


dotenv.config({ path: `.env.local`, override: true });

const app = express();

//Discord BOT

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  if (msg.channelId === "1136204139974635641" && msg.author.id != "1136201492995518515") {
    try {
      const channel = await client.channels.fetch(msg.channelId);

      // Start typing indicator
      await channel.sendTyping();

      var answer = await callMainAgent(msg);

      // Reply to the user in the same channel
      msg.reply(answer);
      // or, send the answer without mentioning the user
      // msg.channel.send(answer);
    } catch (error) {
      console.error("Error while processing the message:", error);
      // Handle any potential errors here and inform the user if necessary
      msg.channel.send("An error occurred while processing your request.");
    }
  }
});

client.login("MTEzNjIwMTQ5Mjk5NTUxODUxNQ.GtNzcW.7Ig4v4_wN8xwJz97gYisl7EZHfKgdCLOFRdjnM");

async function callMainAgent(msg){

  const discordMessage = msg.content;

  const discordId = msg.author.id;

  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst({
      where: { discordId: discordId },
    });

  if (!user) {
    console.log('User not found with discordId:', discordId);
    return "Your discord account has no link to the application : https://qyuuuuu.eu/register . You must first create an account and then link it to discord.";
  }

  let mostRecentConversation = await prisma.conversation.findFirst({
    where: { userId: user.id, NOT: { Name: 'Auto' } },
    orderBy: { id: 'desc' },
  });

  if (!mostRecentConversation) {
    console.log('No conversation found for the user with discordId:', discordId);
    // Create a new conversation with no name if none exists
    mostRecentConversation = await prisma.conversation.create({
      data: {
        User: { connect: { id: user.id } },
      },
    });
  }

  var conversationId = mostRecentConversation.id;


  await prisma.message.create({
    data: {
      content: discordMessage, // Replace with the actual content
      sender: "User",   // Replace with the actual sender
      Conversation: { connect: { id: conversationId } },
      // Add other properties for the character here
    },
  });

  // Now you can use startMain as an async function.
  const botAnswer = await mainAgent(discordMessage, user.id);

  await prisma.message.create({
    data: {
      content: botAnswer.output, // Replace with the actual content
      sender: "Bot",   // Replace with the actual sender
      Conversation: { connect: { id: conversationId } },
      // Add other properties for the character here
    },
  });

  return botAnswer.output;
}

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

app.use(expressStatic('public'));
app.use('/public', expressStatic('public'));
app.use('/Documentation', expressStatic('Documentation'));
app.use('/auth', authRoutes); // Add this line for authentication routes
app.use('/', userRoutes);
app.use('/backend', backendRoutes);
app.use('/admin', adminRoutes);

app.listen(80, () => {
  console.log('Server started on port 80');
});