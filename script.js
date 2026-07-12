const chat = document.getElementById("chat");
const input = document.getElementById("prompt");
const typing = document.getElementById("typing");

// Load saved chat
window.onload = () => {
  const history = localStorage.getItem("forgex_history");
  if (history) {
    chat.innerHTML = history;
  }
};

// Save chat
function saveChat() {
  localStorage.setItem("forgex_history", chat.innerHTML);
}

// New Chat
function newChat() {
  chat.innerHTML = `
    <div class="bot">
      👋 Welcome to ForgeX AI<br><br>
      How can I help you today?
    </div>
  `;
  saveChat();
}

// Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// Voice Input
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input is not supported on this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    input.value = event.results[0][0].transcript;
  };

  recognition.start();
}

// Send Message
async function sendMessage() {
  const message = input.value.trim();

  if (!message) return;

  chat.innerHTML += `<div class="user">${message}</div>`;
  input.value = "";

  typing.style.display = "block";
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    typing.style.display = "none";

    chat.innerHTML += `
      <div class="bot">
        ${data.reply}
      </div>
    `;

    saveChat();
    chat.scrollTop = chat.scrollHeight;

  } catch (error) {

    typing.style.display = "none";

    chat.innerHTML += `
      <div class="bot">
        ❌ Failed to connect with AI.
      </div>
    `;

    chat.scrollTop = chat.scrollHeight;
  }
}