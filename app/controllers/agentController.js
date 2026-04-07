import { startRules } from "../langChain/chains/Main/GodsRulesChain.js";
import { prisma } from '../prisma/prismaClient.js';

/**
 * @fileoverview agentController.js
 * @description Primary handler for incoming HTTP calls from the text-based Chatbot interface.
 * Note: Historical agents (AgentCall / AutoAgentCall) were removed on 2026-04-07. Only the RAG rules assistant remains.
 */

/**
 * @function RulesAgentcall
 * @description HTTP POST endpoint specifically bounding queries for the TTRPG Rules assistant.
 * Features:
 * - Employs `GodsRulesChain.js` RAG chain handler.
 * - Directly records both User Prompt and Bot Answer into the database under the current Conversation ID.
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
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
