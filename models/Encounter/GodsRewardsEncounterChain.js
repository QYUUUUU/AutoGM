import { OpenAI } from "langchain/llms/openai";
import { BaseChain } from "langchain/chains";

export class GodsRewardsEncounterChain extends BaseChain {
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
      modelName: "gpt-3.5-turbo-16k-0613",
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    let sanitizedQuestion = '';
    for (const key in inputs) {
      console.log(inputs[key]);
      sanitizedQuestion += inputs[key];
    }

    var loreGods = "GODS is a dark fantasy role-playing game where players embody heroes in the Savage Lands, a brutal and forsaken continent. They must cooperate to survive in this world of adventure, where magic is scarce and rare, reminiscent of the medieval era. It's a realm of epic and lethal battles, where exploration and the struggle for survival take precedence.   ";

    var Reward_PROMPT = `Reward Agent, based on the generated encounter difficulty and successful completion, suggest suitable rewards and loot for the players in French. Include gold, and any unique or valuable items they might acquire as a result of this encounter.`+loreGods+ sanitizedQuestion;
    const Reward = await model.call(Reward_PROMPT);

    console.log(Reward);
    var res = "Voici les récompenses de la rencontre :  "+Reward;

    return { res };
  }
}
