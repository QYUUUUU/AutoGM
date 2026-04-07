import './bootstrap.min.js';

/**
 * @fileoverview rules_user.js
 * @description Frontend script for the GODS TTRPG rules-lawyer AI chat assistant widget.
 * Features:
 * - Similar to `user.js` but specifically binds to `POST /backend/rules`.
 * - Does NOT handle 3D Dice intercepts, only text responses parsed through `marked.js`.
 * - Manages chat interface bounding limits (`promptField.value.length > 1200`) and message DOM appending (`addMessage`).
 */

//Conversation selection
const conversation = document.getElementsByClassName("conversationid-rules");
var conversationId = conversation.length > 0 ? parseInt(conversation[0].id) : null;

const init = "Bonjour, posez-moi vos questions sur les règles du jeu GODS !";

const button = document.getElementById("send-rules");
const error = document.getElementById("error-rules");

const promptField = document.getElementById("prompt-field-rules");
const responseContainer = document.getElementById("error-rules");
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
  const promptField = document.getElementById("prompt-field-rules");
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
    const response = await fetch("/backend/rules", {
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
    addMessage(data["output"], "assistant");

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
  const chatContainer = document.querySelector('.card-body.chat-body-rules');
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

  var chatContainer = document.querySelector('.card-body.chat-body-rules');
  var message = document.createElement('div');
  message.classList.add('chat-message');

  var messageContent = document.createElement('div');
  messageContent.classList.add('chat-message-content');

  if (sender === "User") {
    message.classList.add("chat-message-right");
    messageContent.innerHTML = content.escape().replace(/\n/g, "<br>");
  } else {
    messageContent.innerHTML = typeof marked !== "undefined" ? marked.parse(content) : content.escape().replace(/\n/g, "<br>");
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
  const parentElement = document.querySelector('.card-body.chat-body-rules');

  // Create a NodeList of all the children except the first one
  const childrenToRemove = parentElement.querySelectorAll(':not(:first-child)');

  // Loop through the NodeList and remove each child
  childrenToRemove.forEach(child => {
    child.remove();
  });
}