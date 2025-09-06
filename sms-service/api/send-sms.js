
import twillio from 'twilio';


export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed" });
  }

  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({ error: "Missing 'to' or 'message'" });
  }

  try {
    const client = twillio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: to,
    });

    return res.status(200).json({ success: true, sid: result.sid });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
