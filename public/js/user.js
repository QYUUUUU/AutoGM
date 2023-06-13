import './bootstrap.min.js';

const init= "Bonjour, je suis programmé pour répondre à vos questions concernant GODS, n'hésitez pas ! 😎";
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

promptField.addEventListener("keydown", function(event) { 
  if (event.key === "Enter" && !event.shiftKey) { 
    if (promptField.value.trim() !== ""){ // check if prompt field is not empty 
      event.preventDefault();
      if(promptField.value.length > 1200){
        alert("Le message que vous essayez d'envoyer est trop long.");
      }else{
        lancementAPI() 
      }
    } 
  } 
});

button.addEventListener("click", async (event) => { 
  if (promptField.value.trim() !== ""){// check if prompt field is not empty 
    if(promptField.value.length > 1200){
      alert("Le message que vous essayez d'envoyer est trop long.");
    }else{
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
  addMessage(prompt, "user");
  
  // Define a variable outside the setTimeout() function to assign a value later
  var typingMessage;
  
  // Show the typing message in 500 milliseconds to indicate the AI is processing
  setTimeout(function() {
    typingMessage = addTypingMessage();
  }, 500);
  
  // Make a POST request to the discussion API endpoint with the user prompt as the body
  const response = await fetch("/backend/agent", {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  },
  body: JSON.stringify({ prompt }),
  });
  
  // Parse the response as JSON
  const data = await response.json();
  
  // Remove the typing message after the response is received
  removeTypingMessage();

  addMessage(data["output"], "assistant");


  
  // Enable user inputs after the API has finished processing
  enableInputs();
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

function addMessage(content, sender) {
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

  if (sender === 'user') {
    message.classList.add('chat-message-right');
    messageContent.innerHTML = content.replace(/\n/g, '<br>');
  } else {
    message.appendChild(createTypingAnimation(content));
  }

  message.appendChild(messageContent);
  message.appendChild(createMessageInfo());

  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  
}

function createTypingAnimation(content) {
  var messageContent = document.createElement('div');
  messageContent.classList.add('chat-message-content');

  var cursor = document.createElement('span');
  cursor.classList.add('chat-cursor');
  cursor.innerHTML = '|';
  messageContent.appendChild(cursor);

  var i = 0;
  var typingInterval = setInterval(function() {
    if (i < content.length) {
      messageContent.innerHTML = content.substr(0, i) + content.substr(i, 5) + '<span class="chat-cursor">|</span>';
      i += 5;
      messageContent.innerHTML = messageContent.innerHTML.replace(/\n/g, '<br>');

      if (i === content.length) {
        clearInterval(typingInterval);
        messageContent.innerHTML = content.replace(/\n/g, '<br>');
        cursor.remove();
      }
    } else {
      clearInterval(typingInterval);
      messageContent.innerHTML = content.replace(/\n/g, '<br>');
      cursor.remove();
    }
  }, getRandomInt(50, 80)); // Adjust typing speed here

  return messageContent;
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
