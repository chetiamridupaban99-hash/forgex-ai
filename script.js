const chat = document.getElementById("chat");
const input = document.getElementById("prompt");
const typing = document.getElementById("typing");

// Load Saved Chat
window.onload = () => {
  const history = localStorage.getItem("forgex_history");

  if (history) {
    chat.innerHTML = history;
  } else {
    showWelcome();
  }

  scrollBottom();
};

// Welcome Screen
function showWelcome() {
  chat.innerHTML = `
    <div class="bot welcome">
      <h2>👋 Welcome to ForgeX AI</h2>

      <p>Your intelligent AI assistant is ready.</p>

      <p>
      Ask me anything about coding, studies,
      technology, writing, business or ideas.
      </p>
    </div>
  `;

  saveChat();
}

// Save Chat
function saveChat() {
  localStorage.setItem(
    "forgex_history",
    chat.innerHTML
  );
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

    input.value =
      event.results[0][0].transcript;

  };

  recognition.start();

}

// Create Message Bubble
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
        message
      })
    });

    const data = await response.json();

    typing.style.display = "none";

    let reply = data.reply || "No response.";

    // Markdown Support
    if (window.marked) {
      reply = marked.parse(reply);
    } else {
      reply = reply.replace(/\n/g, "<br>");
    }

    addMessage("bot", reply);

  } catch (err) {

    typing.style.display = "none";

    addMessage(
      "bot",
      "❌ <b>Connection Failed</b><br><br>Please check your internet connection or try again."
    );

    console.error(err);

  }

}

// Auto Focus
window.addEventListener("load", () => {
  input.focus();
});

// Keep scroll at bottom after images/fonts load
window.addEventListener("load", scrollBottom);

// Optional: Auto-resize on window change
window.addEventListener("resize", scrollBottom);

// Clear typing indicator on page load
typing.style.display = "none";

// Keep chat saved before leaving page
window.addEventListener("beforeunload", saveChat);

// Helper: Escape HTML (optional if you later need it)
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}