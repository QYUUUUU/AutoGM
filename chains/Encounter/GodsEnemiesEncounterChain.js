import { OpenAI } from "langchain/llms/openai";
import { BaseChain } from "langchain/chains";

export class GodsEnemiesEncounterChain extends BaseChain {
  _chainType() {
    throw new Error("Method not implemented.");
  }
  serialize() {
    throw new Error("Method not implemented.");
  }
  inputKeys = ["data"];
  outputKeys = ["res"];

  async _call(inputs) {

    console.log("inputs = "+inputs)

    const model = new OpenAI({
      temperature: 1,
      modelName: "gpt-3.5-turbo-0613",
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    let sanitizedQuestion = '';
    for (const key in inputs) {
      console.log(inputs[key]);
      sanitizedQuestion += inputs[key];
    }

    var loreGods = "GODS is a dark fantasy role-playing game where players embody heroes in the Savage Lands, a brutal and forsaken continent. They must cooperate to survive in this world of adventure, where magic is scarce and rare, reminiscent of the medieval era. It's a realm of epic and lethal battles, where exploration and the struggle for survival take precedence.   ";

    var Enemy_PROMPT = `Enemy Agent, based on the specified encounter type and difficulty level, generate in French a diverse group of enemies that would pose an appropriate challenge. Consider their abilities, strengths, weaknesses, and any special tactics they might employ in this encounter.`+loreGods+ sanitizedQuestion;
    const Enemy = await model.call(Enemy_PROMPT);

    console.log(Enemy);
    var res = "Voici les ennemis de la rencontre :  "+Enemy;

    return { res };
  }
}
