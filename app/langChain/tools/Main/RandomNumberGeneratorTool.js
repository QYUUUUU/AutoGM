import { Tool } from "@langchain/core/tools";

export class RandomNumberGeneratorTool extends Tool {
    name = "Dice-RNG-Tool";
  
    description = "Cet outil DOIT OBLIGATOIREMENT être appelé pour structurer les lancers libres (ex: 5d20, 2d10) en JSON. Interdiction d'inventer toi-même la réponse. Fournis la formule de lancer de dès complète extraite (ex: '5d20, 2d10').";
    
    async _call(numbers){
      try {
        let inputString = typeof numbers === "string" ? numbers : JSON.stringify(numbers);
        inputString = inputString.toLowerCase();
        
        let payload = {
          type: "dice",
          diceCounts: {},
          caracteristic: null,
          competence: null,
          relances: 0
        };

        // Regex to match "5d20", "2 dés 6", "1 d 100", "4des8"
        const regex = /(\d+)?[\s_-]*(?:d|dé|des|dés)[\s_-]*(\d+)/g;
        let match;
        let found = false;

        while ((match = regex.exec(inputString)) !== null) {
          found = true;
          let amount = match[1] ? parseInt(match[1]) : 1;
          let faces = parseInt(match[2]);
          if (!isNaN(faces) && faces > 0) {
            let key = `d${faces}`;
            payload.diceCounts[key] = (payload.diceCounts[key] || 0) + amount;
          }
        }

        if (!found) {
            // Fallback just in case
            let clean = inputString.replace(/[^0-9d]/g, "");
            let nums = clean.split("d");
            let amount = parseInt(nums[0]) || 1;
            let faces = parseInt(nums[1]) || 10;
            payload.diceCounts[`d${faces}`] = amount;
        }

        return JSON.stringify(payload);
      } catch (error) {
        return JSON.stringify({ type: "error", message: error.message });
      }
    }
}
