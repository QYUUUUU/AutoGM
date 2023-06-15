import { Tool } from "langchain/tools";

export class RandomNumberGeneratorTool extends Tool {
    name = "Dice RNG Tool";
  
    description = "This tool generates a random number for a chosen amount of type of dice (4d20) with the results separately for the user";
  
    async _call(numbers){
      try {
        let cleanString = numbers.replace(/\s/g, ""); // Remove whitespace
        let nums = cleanString.split("d"); // Split the string at the comma
        let amount = parseInt(nums[0]); // Convert the first substring to an integer
        let max = parseInt(nums[1]);
        let min = 1;
        let results = []; // Array to store the generated random numbers

        for (let i = 0; i < amount; i++) {
          const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
          results.push(randomNumber.toString()); // Add the random number as a string to the results array
        }

        // Join the results array with a line break to separate the numbers
        const resultsString = results.join(" ");

        // Return the output text with the separate results
        return `Réponse:\n${resultsString}`;
      } catch (error) {
        // Handle any errors that occur during the processing
        return `Error occurred: ${error.message}`;
      }
    }
  }