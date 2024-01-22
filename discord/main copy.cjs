const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');

async function loadStartMain() {
  const module = await import("../agents/mainAgent.js");
  return module.startMain;
}


const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        // ...
    ]
})
const dotenv = require('dotenv');

dotenv.config({ path: `../.env.local`, override: true });

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", async (msg) => {
  console.log(msg);
  if(msg.channelId == "1136204139974635641"){
    var answer = await callMainAgent(msg);
  }
 
  console.log(answer);
});


client.login(process.env.DISCORD_TOKEN);

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

  const startMain = await loadStartMain();
  if (!startMain) {
    console.log("The module is still loading. Please wait.");
    return "Loading ...";
  }

  // Now you can use startMain as an async function.
  const botAnswer = await startMain(discordMessage, user.id);

  await prisma.message.create({
    data: {
      content: botAnswer.output, // Replace with the actual content
      sender: "Bot",   // Replace with the actual sender
      Conversation: { connect: { id: conversationId } },
      // Add other properties for the character here
    },
  });

  return botAnswer;
}