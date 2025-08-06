export default function handler(req, res) {
  res.status(200).json({
    apiKeyStatus: process.env.OPENAI_API_KEY ? '✅ FOUND' : '❌ MISSING'
  });
}
