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
        model: "gpt-4o-mini-realtime-preview",
        // ★ここが重要：オブジェクトではなく文字列で指定
        input_audio_format: "pcm16",
        // modalities は省略可（必要なら ["audio","text"]）
      }),
    });

    const text = await r.text();
    res.status(r.status).setHeader("content-type", "application/json").send(text);
  } catch (e: any) {
    res.status(500).send(e?.message ?? "proxy error");
  }
}
