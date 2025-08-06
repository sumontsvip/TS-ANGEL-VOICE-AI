export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key is missing" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // use this unless you're 100% sure gpt-4 is allowed
        messages: [
          { role: "system", content: "You are TS Angel. Reply like a helpful voice assistant. You understand Bangla, Hindi, and English." },
          { role: "user", content: req.body.message }
        ]
      })
    });

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]) {
      return res.status(500).json({ error: "Invalid GPT response" });
    }

    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("OpenAI API error:", err);
    return res.status(500).json({ error: "Failed to connect to GPT API." });
  }
}
