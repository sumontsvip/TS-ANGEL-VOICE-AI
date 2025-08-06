export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are TS Angel. Reply like a helpful voice assistant. You understand Bangla, Hindi, and English." },
          { role: "user", content: req.body.message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Failed to connect to GPT API." });
  }
}
