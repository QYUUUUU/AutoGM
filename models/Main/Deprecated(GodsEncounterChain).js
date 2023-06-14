import { OpenAI } from "langchain/llms/openai";
import { BaseChain } from "langchain/chains";

export class GodsEncounterChain extends BaseChain {
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

    var Description_PROMPT = `Description Agent, please provide a vivid and immersive description of the environment where the encounter takes place. Consider the specified environmental factors, such as weather conditions, terrain features, or any notable elements that make this location unique. `+loreGods+ sanitizedQuestion;
    const Description = await model.call(Description_PROMPT);

    var Enemy_PROMPT = `Enemy Agent, based on the specified encounter type and difficulty level, generate a diverse group of enemies that would pose an appropriate challenge. Consider their abilities, strengths, weaknesses, and any special tactics they might employ in this encounter.`+loreGods+ sanitizedQuestion;
    const Enemy = await model.call(Enemy_PROMPT);

    var Tactics_PROMPT = `Tactics Agent, please analyze the generated enemies and provide optimal tactics and strategies they would employ in this encounter. Consider their abilities, environmental factors, and any potential interactions or synergies between the enemies. : `+loreGods + Description + Enemy;
    const Tactics = await model.call(Tactics_PROMPT);

    var Reward_PROMPT = `Reward Agent, based on the generated encounter difficulty and successful completion, suggest suitable rewards and loot for the players. Include gold, and any unique or valuable items they might acquire as a result of this encounter.`+loreGods+ sanitizedQuestion;
    const Reward = await model.call(Reward_PROMPT);


    console.log(Description, Enemy, Tactics, Reward);
    var res = "Voici la réponse : ###"+Description + Enemy + Tactics + Reward+ " ### Il faut impérativement la rendre mot pour mot à l'utilisateur traduis en Français";

    return { res };
  }
}
