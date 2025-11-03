// api/token.ts — Nodeランタイム（CJS互換）
export default async function handler(req: any, res: any) {
  try {
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "realtime=v1",
      },
      body: JSON.stringify({
        // ✅ Realtime対応モデル名に変更
        model: "gpt-4o-mini-realtime-preview",
        modalities: ["audio", "text"],
      }),
    });

    const data = await r.json();
    res.setHeader("Content-Type", "application/json");
    res.status(r.status).send(JSON.stringify(data));
  } catch (err: any) {
    res.status(500).json({ error: err.message ?? "proxy error" });
  }
}
