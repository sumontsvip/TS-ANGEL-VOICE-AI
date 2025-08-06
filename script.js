const output = document.getElementById("output");

async function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-IN';
  speechSynthesis.speak(utter);
}

async function sendToGPT(message) {
  output.innerText = "🧠 Thinking...";
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are TS Angel. Reply like a sweet voice assistant. Understand Bangla, Hindi, English."
          },
          {
            role: "user",
            content: message
          }
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
  recognition.lang = 'en-IN';
  recognition.interimResults = false;

  recognition.onstart = () => {
    output.innerText = "🎧 Listening...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    output.innerText = `You said: "${transcript}"`;
    sendToGPT(transcript);
  };

  recognition.onerror = () => {
    output.innerText = "❌ Voice recognition failed!";
  };

  recognition.start();
}
