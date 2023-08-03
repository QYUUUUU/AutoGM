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
import { startMain as autoAgent } from "./agents/autoAgent.js";

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

      // Split the answer into chunks at sentence-ending periods
      const chunks = splitResponseIntoChunks(answer, 1999);

      // Send each chunk separately
      for (const chunk of chunks) {
        // Reply to the user in the same channel
        await msg.reply(chunk);
        // or, send the chunk without mentioning the user
        // await msg.channel.send(chunk);

        // Add a small delay before sending the next chunk
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error("Error while processing the message:", error);
      // Handle any potential errors here and inform the user if necessary
      msg.channel.send("An error occurred while processing your request.");
    }
  }
  
  if (msg.channel.parent.name === 'Alone' && msg.author.id != "1136201492995518515") {
    try {
      const channel = await client.channels.fetch(msg.channelId);

      // Start typing indicator
      await channel.sendTyping();

      var answer = await callAutoAgent(msg);
      
      // Split the answer into chunks at sentence-ending periods
      const chunks = splitResponseIntoChunks(answer, 1999);

      // Send each chunk separately
      for (const chunk of chunks) {
        // Reply to the user in the same channel
        await msg.reply(chunk);
        // or, send the chunk without mentioning the user
        // await msg.channel.send(chunk);

        // Add a small delay before sending the next chunk
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

    } catch (error) {
      console.error("Error while processing the message:", error);
      // Handle any potential errors here and inform the user if necessary
      msg.channel.send("An error occurred while processing your request.");
    }
  }
});

client.login(process.env.BOT_TOKEN);

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

    await prisma.message.create({
      data: {
        content: `Your name is GM. You are a Game Master of a tabletop RPG game and you narrate situations in which, I, the player, make decisions. The world you are making me play in is a Dark fantasy themed one. The scenario takes place in a medieval city of the kingdom of Avhorea. The ruler of the kingdom is "Sevire the Red", nickname she acquired by killing all the noble houses that were her ennemies, and by disennobling the weakest ones she still has ennemies within her kingdom, although they don't fight her upfront and scheme in the shadows.

        Adrien se réveille un matin au camp militaire de son régiment. Adrien est un soldat de l’empire du soleil noir. Il fait partit du 17ème régiment, composé de 2500 hommes.
        
        Le Culte du Soleil Noir est une religion fanatique qui prêche l'arrivée d'un nouveau Prophète et considère le soleil comme l'Œil de l'Unique. Ils organisent des fêtes religieuses appelées le Massacre du Soleil Noir, où des orgies ont lieu et des sacrifices violents sont effectués.
        
        Son régiment, aux côtés du 16ème, est chargé d’assister Vox Aedes, l’ordre dont la mission est de répandre le Culte du soleil noir dans leur mission actuelle, faire du prosélytisme en Avhorae.
        
        Le Culte tente d'infiltrer les terres de l'ouest en général, mais a été interdit depuis l'ascension de Sevire au trône d’Avhorae.
        
        Des purges ont même été organisées par Sévire pour éliminer les congrégations clandestines mais les fidèles du Culte tentent maintenant de recruter parmi les survivants des familles ducales déchues lors de l’accession au pouvoir de Sévire.
        
        Adrien est donc rapidement équipé et prêt à aider à l’installation du camp caché dans la montagne au nord de la ville de Cyridon.
        
        Durant la matinée, Adrius est interrompu dans ses corvées par son officier responsable qui lui demande de le suivre vers la tente du général.
        
        drien et son groupe, désormais équipés d'habits civils, commencent leur infiltration dans la ville de Cyridon. Ils doivent se mêler à la population locale pour obtenir des informations cruciales sur l'exécution publique planifiée par Sévire.
        
        Sevire has a magical sword, that make her almost as strong as a god, and 8 other blades are weilded by her most faithful servents, and generals of her army, the silver phalanx.
        
        To help yourself, you must use tools when necessary. Always decide the player's actions resolution via the throwing of a d20 dice.
        
        If you have a general question about the lore of GODS or its rules use the tool gods-lore with the Action gods-lore and the Action Input set to the question asked, the tool will then answer your question.
        
        You must be immersive for the user by describing the world and characters with precision and poetry, and by respecting the user's choices and actions. Always interact with the user and wait to be surprised by their creativity before deciding anything for them.`, // Replace with the actual content
        sender: "Bot",   // Replace with the actual sender
        Conversation: { connect: { id: mostRecentConversation.id } },
        // Add other properties for the character here
      },
    });

    await prisma.message.create({
      data: {
        content: "Bienvenue dans le royaume d'Avhorea, cher voyageur. Vous incarnez un garde de l'empire du Soleil noir chargé d'espionner le royaume d'Avhorae et son impératrice Sévire, dites moi quand vous voulez commencer à jouer.'.", // Replace with the actual content
        sender: "Bot",   // Replace with the actual sender
        Conversation: { connect: { id: mostRecentConversation.id } },
        // Add other properties for the character here
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

async function callAutoAgent(msg){

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
    where: { userId: user.id, Name: 'Auto' },
    orderBy: { id: 'desc' },
  });

  if (!mostRecentConversation) {
    console.log('No conversation found for the user with discordId:', discordId);
    // Create a new conversation with no name if none exists
    mostRecentConversation = await prisma.conversation.create({
      data: {
        User: { connect: { id: user.id } },
        Name: 'Auto',
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

  const messages = await prisma.message.findMany({
    where: {
      Conversation: {
        id: conversationId,
      },
    },
  });

  // Now you can use startMain as an async function.
  const botAnswer = await autoAgent(discordMessage, user.id, messages);

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

function splitResponseIntoChunks(response, maxLength) {
  const chunks = [];
  const sentences = response.split('. ');

  let currentChunk = "";
  for (const sentence of sentences) {
    if ((currentChunk + sentence + '. ').length <= maxLength) {
      currentChunk += sentence + '. ';
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = sentence + '. ';
    }
  }

  // Add the last chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}