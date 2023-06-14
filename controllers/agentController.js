import { startMain } from "../agents/mainAgent.js"

export async function Agentcall(req, res) {
  try {
    const data = req.body;
    const result = await startMain(data.prompt);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing request");
  }
}
