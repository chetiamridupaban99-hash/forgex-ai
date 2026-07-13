const chat = document.getElementById("chat");
const input = document.getElementById("prompt");
const typing = document.getElementById("typing");

// Load Chat
window.onload = () => {

  const history = localStorage.getItem("forgex_history");

  if (history) {
    chat.innerHTML = history;
  } else {
    showWelcome();
  }

  input.focus();
  scrollBottom();
};

// Welcome Screen
function showWelcome() {

  chat.innerHTML = `
    <div class="bot welcome">
      <h2>👋 Welcome to ForgeX AI</h2>
      <p>Your intelligent AI assistant is ready.</p>
      <p>Ask me anything about coding, studies, technology, writing, business or ideas.</p>
    </div>
  `;

  saveChat();
}

// Save Chat
function saveChat() {
  localStorage.setItem("forgex_history", chat.innerHTML);
}

// Scroll Bottom
function scrollBottom() {
  chat.scrollTop = chat.scrollHeight;
}

// New Chat
function newChat() {
  localStorage.removeItem("forgex_history");
  showWelcome();
  scrollBottom();
}

// Enter Key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Voice Input
function startVoice() {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input is not supported.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
  };

  recognition.start();
}

// Add Message
function addMessage(type, html) {

  const div = document.createElement("div");

  div.className = type;

  div.innerHTML = html;

  chat.appendChild(div);

  saveChat();

  scrollBottom();

}

// Send Message
async function sendMessage() {

  const message = input.value.trim();

  if (!message) return;

  addMessage("user", message);

  input.value = "";

  typing.style.display = "block";

  scrollBottom();

  try {

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    });

    const data = await response.json();

    typing.style.display = "none";

    let reply = data.reply || "No response.";

    if (window.marked) {
      reply = marked.parse(reply);
    } else {
      reply = reply.replace(/\n/g, "<br>");
    }

    addMessage("bot", reply);

  } catch (error) {

    typing.style.display = "none";

    addMessage(
      "bot",
      "❌ <b>Failed to connect with ForgeX AI.</b><br><br>Please try again in a few moments."
    );

    console.error(error);

  }

}

// Hide typing on startup
typing.style.display = "none";

// Auto Focus
window.addEventListener("load", () => {
  input.focus();
});

// Save before leaving
window.addEventListener("beforeunload", saveChat);

// Keep scroll at bottom
window.addEventListener("resize", scrollBottom);