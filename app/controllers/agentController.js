import { startRules } from "../langChain/chains/Main/GodsRulesChain.js";
import { startMain as mainStart } from "../langChain/agents/mainAgent.js"
import { startMain as autoStart } from "../langChain/agents/autoAgent.js"

import { prisma } from '../prisma/prismaClient.js';

export async function Agentcall(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != "" && req.session.userId != null) {
    try {
      const data = req.body;
      const conversationId = data.conversationId;

      await prisma.message.create({
        data: {
          content: data.prompt, // Replace with the actual content
          sender: "User",   // Replace with the actual sender
          conversationId: conversationId,
          // Add other properties for the character here
        },
      });

      const result = await mainStart(data.prompt, req.session.userId);

      let isDiceRoll = false;
      let diceData = null;
      let botOutput = result.output;

      try {
        diceData = JSON.parse(result.output);
        if (diceData && diceData.type === "dice") {
          isDiceRoll = true;
        } else if (diceData && diceData.message) {
          botOutput = diceData.message;
        } else if (diceData && diceData.error) {
          botOutput = diceData.error;
        }
      } catch (e) {
        // Not JSON
      }

      if (!isDiceRoll) {
        await prisma.message.create({
          data: {
            content: botOutput,
            sender: "Bot",
            conversationId: conversationId,
          },
        });
      }

      res.json({ output: botOutput, isDice: isDiceRoll, diceData: diceData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.render('../views/login.html.twig');
  }
}

export async function AutoAgentcall(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != "" && req.session.userId != null) {
    try {
      const data = req.body;
      const conversationId = data.conversationId;

      await prisma.message.create({
        data: {
          content: data.prompt, // Replace with the actual content
          sender: "User",   // Replace with the actual sender
          conversationId: conversationId,
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

      const result = await autoStart(data.prompt, req.session.userId, messages);

      await prisma.message.create({
        data: {
          content: result.output, // Replace with the actual content
          sender: "Bot",   // Replace with the actual sender
          conversationId: conversationId,
          // Add other properties for the character here
        },
      });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.render('../views/login.html.twig');
  }
}


export async function RulesAgentcall(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != "" && req.session.userId != null) {
    try {
      const data = req.body;
      const conversationId = data.conversationId;

      await prisma.message.create({
        data: {
          content: data.prompt,
          sender: "User",
          conversationId: conversationId,
        },
      });

      const result = await startRules(data.prompt, req.session.userId);

      await prisma.message.create({
        data: {
          content: result.output,
          sender: "Bot",
          conversationId: conversationId,
        },
      });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.render('../views/login.html.twig');
  }
}
