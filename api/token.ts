// api/token.ts — Nodeランタイム（CJS互換）
export default async function handler(req: any, res: any) {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "realtime=v1",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-transcribe",
      modalities: ["audio", "text"],
    }),
  });

  const data = await r.json();
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(data));
}
