import { startMain } from "../agents/mainAgent.js"

import { PrismaClient } from '@prisma/client';



export async function Agentcall(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != ""  && req.session.userId != null){
    try {
      const data = req.body;
      const conversationId = data.conversationId;
      const prisma = new PrismaClient();

      await prisma.message.create({
        data: {
          content: data.prompt, // Replace with the actual content
          sender: "User",   // Replace with the actual sender
          Conversation: { connect: { id: conversationId } },
          // Add other properties for the character here
        },
      });
      
      const result = await startMain(data.prompt, req.session.userId);
      
      await prisma.message.create({
        data: {
          content: result.output, // Replace with the actual content
          sender: "Bot",   // Replace with the actual sender
          Conversation: { connect: { id: conversationId } },
          // Add other properties for the character here
        },
      });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  }else{
    res.render('../views/login.html.twig');
  }
}
