const output = document.getElementById("output");

async function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-IN'; // You can change to 'bn-BD' or 'hi-IN' as needed
  speechSynthesis.speak(utter);
}

async function sendToGPT(message) {
  output.innerText = "🧠 Thinking...";
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    const reply = data.reply || "❌ No response from server.";
    output.innerText = reply;
    speak(reply);
  } catch (err) {
    output.innerText = "❌ Error connecting to GPT!";
    speak("Sorry, something went wrong.");
    console.error(err);
  }
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-IN'; // Use 'bn-BD' for Bangla, 'hi-IN' for Hindi
  recognition.interimResults = false;

  recognition.onstart = () => {
    output.innerText = "🎧 Listening...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    output.innerText = `You said: "${transcript}"`;
    sendToGPT(transcript);
  };

  recognition.onerror = (event) => {
    output.innerText = "❌ Voice recognition failed!";
    speak("Voice input failed.");
  };

  recognition.start();
}
