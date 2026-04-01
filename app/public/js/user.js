import './bootstrap.min.js';



//Conversation selection
const conversation = document.getElementsByClassName("conversationid");
var conversationId = conversation.length > 0 ? parseInt(conversation[0].id) : null;

const init = "Bonjour, je suis programmé pour t'aider à jouer à GODS. Tu peux me demander de lancer les dés de ton choix 'Lance cinq dés 20 s'il te plait', ou directement depuis la fiche de personnage sélectionnée dans la sidebar ('jette précision et tir avec modifieur à -2'). Je connais aussi les livres par coeur alors n'hésite pas à me poser des questions ('Parle moi d'Aon') ! 😎";
addMessage(init, "assistant");

const button = document.getElementById("send");
const error = document.getElementById("error");

const promptField = document.getElementById("prompt-field");
const responseContainer = document.getElementById("error");
function disableInputs() {
  promptField.disabled = true;
  button.disabled = true;
}

function enableInputs() {
  promptField.disabled = false;
  button.disabled = false;
}

promptField.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    if (promptField.value.trim() !== "") { // check if prompt field is not empty 
      event.preventDefault();
      if (promptField.value.length > 1200) {
        alert("Le message que vous essayez d'envoyer est trop long.");
      } else {
        lancementAPI()
      }
    }
  }
});

button.addEventListener("click", async (event) => {
  if (promptField.value.trim() !== "") {// check if prompt field is not empty 
    if (promptField.value.length > 1200) {
      alert("Le message que vous essayez d'envoyer est trop long.");
    } else {
      event.preventDefault();
      lancementAPI()
    }
  }
});

// This function is asynchronous and is used to handle the API launch
async function lancementAPI() {

  // disable the user inputs while the API is processing
  disableInputs();

  // Get the prompt entered by the user and clear the input field
  const promptField = document.getElementById("prompt-field");
  const prompt = promptField.value;
  promptField.value = "";

  // Add the user prompt message to the conversation
  addMessage(prompt, "User");

  // Define a variable outside the setTimeout() function to assign a value later
  let typingMessage = null;

  // Show the typing message in 500 milliseconds to indicate the AI is processing
  const typingTimer = setTimeout(function () {
    typingMessage = addTypingMessage();
  }, 500);

  try {
    // Make a POST request to the discussion API endpoint with the user prompt as the body
    const response = await fetch("/backend/agent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, conversationId }),
    });

    clearTimeout(typingTimer);
    if (typingMessage) {
      removeTypingMessage(typingMessage);
    }

    if (!response.ok) {
        throw new Error("Server Error");
    }

    // Parse the response as JSON
    const data = await response.json();
    
    if (data.isDice && data.diceData && data.diceData.diceCounts) {
      if (typeof window.randomDiceThrow === 'function') {
        window.randomDiceThrow(data.diceData.diceCounts, data.diceData.relances || 0, data.diceData.caracteristic || null, data.diceData.competence || null, true);
      } else {
        console.error("randomDiceThrow not found");
      }
    } else {
      addMessage(data["output"], "assistant");
    }

  } catch (error) {
    clearTimeout(typingTimer);
    if (typingMessage) {
      removeTypingMessage(typingMessage);
    }
    addMessage("Désolé, une erreur s'est produite lors de la communication avec l'assistant.", "assistant");
  } finally {
    // Enable user inputs after the API has finished processing
    enableInputs();
  }
}

function addTypingMessage() {
  const chatContainer = document.querySelector('.card-body.chat-body');
  const typingMessage = document.createElement('div');
  typingMessage.classList.add('loading');
  typingMessage.id = "loading";

  chatContainer.appendChild(typingMessage);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  return typingMessage;
}

function removeTypingMessage(typingMessage) {
  typingMessage.remove();
}

function addMessage(content, sender) {
  String.prototype.escape = function () {
    var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function (tag) {
      return tagsToReplace[tag] || tag;
    });
  };

  var chatContainer = document.querySelector('.card-body.chat-body');
  var message = document.createElement('div');
  message.classList.add('chat-message');

  var messageContent = document.createElement('div');
  messageContent.classList.add('chat-message-content');

  if (sender === 'User') {
    message.classList.add('chat-message-right');
    messageContent.innerHTML = content.escape().replace(/\n/g, '<br>');
  } else {
    messageContent.innerHTML = typeof marked !== 'undefined' ? marked.parse(content) : content.escape().replace(/\n/g, '<br>');
  }

  message.appendChild(messageContent);
  message.appendChild(createMessageInfo());

  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function createMessageInfo() {
  var messageInfo = document.createElement('div');
  messageInfo.classList.add('chat-message-info');
  messageInfo.innerHTML = '<span class="chat-message-time">' + getCurrentTime() + '</span>';
  return messageInfo;
}

function getCurrentTime() {
  const currentDate = new Date();
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes}`;
  return timeString;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Favorite Character Handling

const favoriteSelect = document.getElementById("favoriteCharacter");
let characterId = 0;
favoriteSelect.addEventListener("change", async () => {
  characterId = favoriteSelect.value;
  try {
    const response = await fetch(`/Character/Favorite/set/${characterId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
  }
});

function displayConversation(data) {
  cleanConversation();
  data.forEach(message => {
    var sender = "";
    if (message["sender"] == "User") {
      sender = "User"
    } else {
      sender = "Bot"
    }
    addMessage(message.content, sender)
  });
}

function cleanConversation() {
  const parentElement = document.querySelector('.card-body.chat-body');

  // Create a NodeList of all the children except the first one
  const childrenToRemove = parentElement.querySelectorAll(':not(:first-child)');

  // Loop through the NodeList and remove each child
  childrenToRemove.forEach(child => {
    child.remove();
  });
}