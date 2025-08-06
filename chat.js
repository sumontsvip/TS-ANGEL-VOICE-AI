export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ message: "API key is missing from environment" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // ✅ Use this unless you’re upgraded for gpt-4
        messages: [
          {
            role: "system",
            content: "You are TS Angel. Reply sweetly. Understand Bangla, Hindi, and English.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "OpenAI error" });
    }

    return res.status(200).json({ reply: data.choices?.[0]?.message?.content });
  } catch (error) {
    console.error("GPT Fetch Error:", error);
    return res.status(500).json({ error: "Failed to connect to GPT API." });
  }
}
