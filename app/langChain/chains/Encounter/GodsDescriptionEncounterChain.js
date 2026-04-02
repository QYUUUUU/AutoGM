import { OpenAI } from "@langchain/openai";
import { BaseChain } from "@langchain/classic/chains";

export class GodsDescriptionEncounterChain extends BaseChain {
  _chainType() {
    throw new Error("Method not implemented.");
  }
  serialize() {
    throw new Error("Method not implemented.");
  }
  inputKeys = ["data"];
  outputKeys = ["res"];

  async _call(inputs) {
    const model = new OpenAI({
      temperature: 1,
      modelName: "gpt-3.5-turbo",
      verbose: false,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    let sanitizedQuestion = '';
    for (const key in inputs) {
      sanitizedQuestion += inputs[key];
    }

    var loreGods = "GODS is a dark fantasy role-playing game where players embody heroes in the Savage Lands, a brutal and forsaken continent. They must cooperate to survive in this world of adventure, where magic is scarce and rare, reminiscent of the medieval era. It's a realm of epic and lethal battles, where exploration and the struggle for survival take precedence.   ";

    var Description_PROMPT = `Description Agent, please provide in French a vivid and immersive description of the environment where the encounter takes place. Consider the specified environmental factors, such as weather conditions, terrain features, or any notable elements that make this location unique. ` + loreGods + sanitizedQuestion;
    const Description = await model.call(Description_PROMPT);

    var res = "Voici la description de la rencontre :  " + Description;

    return { res };
  }
}
