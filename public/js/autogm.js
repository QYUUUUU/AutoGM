import './bootstrap.min.js';



//Conversation selection
const conversations = document.getElementsByClassName("new-chat");
var conversationId = 0;


// Define the event listener function
async function eventListenerFunction(event) {
  // Your event handling code goes here
  conversationId = event.target.id;
  conversationId = parseInt(conversationId);
  const link = `/Conversation/get/${conversationId}`;

  try {
    const response = await fetch(link);

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Parse the JSON data
    const data = await response.json();

    // Use the JSON data here
    console.log(data);
    displayConversation(data);
  } catch (error) {
    // Handle errors here
    console.error("Error:", error);
  }
}


// Loop through the collection and attach the event listener to each element
for (let i = 0; i < conversations.length; i++) {
  conversations[i].addEventListener("click", eventListenerFunction);
  conversationId = (conversations[i].id > conversationId) ? conversations[i].id : conversationId;
}

// Create an object called 'init'
var setupConversation = {};
console.log(conversationId)
// Assign 'conversationId' to the 'id' property inside the nested 'target' object
setupConversation["target"] = {};
setupConversation["target"]["id"] = conversationId;

eventListenerFunction(setupConversation);

const button = document.getElementById("send");
const error = document.getElementById("error");

const promptField = document.getElementById("prompt-field");
function disableInputs() { 
  promptField.disabled = true; 
  button.disabled = true; 
}

function enableInputs() { 
  promptField.disabled = false;
  button.disabled = false; 
} 

promptField.addEventListener("keydown", function(event) { 
  if (event.key === "Enter" && !event.shiftKey) { 
    if (promptField.value.trim() !== ""){ // check if prompt field is not empty 
      event.preventDefault();
        lancementAPI() 
    } 
  } 
});

button.addEventListener("click", async (event) => { 
  if (promptField.value.trim() !== ""){// check if prompt field is not empty 
      event.preventDefault();
      lancementAPI() 
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
  var typingMessage;
  
  // Show the typing message in 500 milliseconds to indicate the AI is processing
  setTimeout(function() {
    typingMessage = addTypingMessage();
  }, 500);
  
  // Make a POST request to the discussion API endpoint with the user prompt as the body
  const response = await fetch("/backend/autoagent", {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  },
  body: JSON.stringify({ prompt,conversationId }),
  });

    // Remove the typing message after the response is received
    removeTypingMessage();
    
    // Enable user inputs after the API has finished processing
    enableInputs()
  
  // Parse the response as JSON
  const data = await response.json();
  
  addMessage(data["output"], "assistant");

}

function addTypingMessage() {
    const chatContainer = document.querySelector('.card-body.chat-body');
    const typingMessage = document.createElement('div');
    typingMessage.classList.add('loading');
    typingMessage.id="loading";
  
    chatContainer.appendChild(typingMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  
    return typingMessage;
}

function removeTypingMessage(typingMessage) {
    document.getElementById("loading").remove();
}

async function addMessage(content, sender) {
  String.prototype.escape = function() {
    var tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;'
    };
    return this.replace(/[&<>]/g, function(tag) {
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
    messageContent.innerHTML = content.replace(/\n/g, '<br>');
  } else {
    messageContent.innerHTML = content.replace(/\n/g, '<br>');
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

// Favorite Character Handling
const favoriteSelect = document.getElementById("favoriteCharacter");

favoriteSelect.addEventListener("change", async ()=>{
  const characterId = favoriteSelect.value;
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
  for (let i = 1; i < data.length; i++) {
    var message = data[i];
    var sender = message.sender === "User" ? "User" : "Bot";
    addMessage(message.content, sender);
  }
}

function cleanConversation() {
  const parentElement = document.querySelector('.card-body.chat-body');

  // Create a list of all the children
  const children = parentElement.children;

  // Loop through the children (including the first one) and remove each child
  for (let i = children.length - 1; i >= 0; i--) {
    children[i].remove();
  }
}