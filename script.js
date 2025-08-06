const OPENAI_API_KEY = "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";

const output = document.getElementById("output");

async function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'bn-BD'; // Bangla (use 'en-IN' for English/Hindi)
  speechSynthesis.speak(utter);
}

async function sendToGPT(message) {
  output.innerText = "🧠 Thinking...";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Or "gpt-4" if your key supports
        messages: [
          {
            role: "system",
            content: "You are TS Angel, a smart Bangla-English-Hindi voice assistant. Speak politely and answer all questions clearly."
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
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
  recognition.lang = 'bn-BD'; // Change to 'en-IN' for English/Hindi
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
    speak("Sorry, couldn't hear you.");
  };

  recognition.start();
}
