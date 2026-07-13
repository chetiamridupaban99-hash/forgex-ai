const chat = document.getElementById("chat");
const input = document.getElementById("prompt");
const typing = document.getElementById("typing");

// Conversation Memory
let conversation = [];

// Load Chat
window.onload = () => {

  const history = localStorage.getItem("forgex_history");

  if(history){

    chat.innerHTML = history;

  }else{

    showWelcome();

  }

  input.focus();

  scrollBottom();

};

// Welcome Screen
function showWelcome(){

chat.innerHTML = `
<div class="bot welcome">

<h2>👋 Welcome to ForgeX AI</h2>

<p>Your intelligent AI assistant is ready.</p>

<p>
Ask anything about coding,
technology,
studies,
writing,
business,
or ideas.
</p>

</div>
`;

saveChat();

}

// Save Chat
function saveChat(){

localStorage.setItem(
"forgex_history",
chat.innerHTML
);

}

// Scroll
function scrollBottom(){

chat.scrollTop = chat.scrollHeight;

}

// New Chat
function newChat(){

conversation=[];

localStorage.removeItem("forgex_history");

showWelcome();

scrollBottom();

}

// Enter
input.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

sendMessage();

}

});

// Voice
function startVoice(){

const SpeechRecognition=
window.SpeechRecognition||
window.webkitSpeechRecognition;

if(!SpeechRecognition){

alert("Voice input not supported.");

return;

}

const recognition=new SpeechRecognition();

recognition.lang="en-US";

recognition.onresult=(event)=>{

input.value=event.results[0][0].transcript;

};

recognition.start();

}

// Add Message
function addMessage(type,html){

const div=document.createElement("div");

div.className=type;

div.innerHTML=html;

chat.appendChild(div);

saveChat();

scrollBottom();

}

// Send Message
async function sendMessage(){

const message=input.value.trim();

if(!message) return;

// Save user message in memory
conversation.push({
role:"user",
text:message
});

addMessage("user",message);

input.value="";

typing.style.display="block";

scrollBottom();

try{

const response=await fetch("/api/chat",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

conversation

})

});

const data=await response.json();

typing.style.display="none";

let reply=data.reply||"No response.";

if(window.marked){

reply=marked.parse(reply);

}else{

reply=reply.replace(/\n/g,"<br>");

}

// Save AI reply in memory
conversation.push({

role:"assistant",

text:data.reply

});

addMessage("bot",reply);

}catch(err){

typing.style.display="none";

addMessage(

"bot",

"❌ <b>Connection Failed</b><br><br>Please check your internet connection and try again."

);

console.error(err);

}

}