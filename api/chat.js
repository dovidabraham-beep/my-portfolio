export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  console.log("ANTHROPIC_KEY exists:", !!process.env.ANTHROPIC_KEY);
  console.log("All env keys:", Object.keys(process.env).filter(k => k.includes("ANTHROP")));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(req.body),
  });

  
  const data = await response.json();
  console.log("Anthropic response:", JSON.stringify(data));
  res.status(200).json(data);
}