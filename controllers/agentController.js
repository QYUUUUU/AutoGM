import { startMain } from "../agents/mainAgent.js"

import { PrismaClient } from '@prisma/client';



export async function Agentcall(req, res) {
  if (req.session.userId != "undefined" && req.session.userId != ""  && req.session.userId != null){
    try {
      const data = req.body;
      const prisma = new PrismaClient();
      const result = await startMain(data.prompt, req.session.userId);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  }else{
    res.render('../views/login.html.twig');
  }
}
