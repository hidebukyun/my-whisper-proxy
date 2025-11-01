// api/token.ts  — Vercel Serverless Function 形式（Edgeでも可）
export const config = { runtime: "edge" }; // Edge不要なら削除OK

export default async function handler(req: Request) {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // ← 本物の sk-...（Vercel env に設定）
      "Content-Type": "application/json",
      "OpenAI-Beta": "realtime=v1",
    },
    body: JSON.stringify({
      // ★ 文字起こし専用のモデルに戻す
      model: "gpt-4o-mini-transcribe",
      - modalities: ["audio"],
      + modalities: ["audio", "text"],
           // 文字起こしだけなら audio で十分
      // 必要なら入力形式を宣言（AndroidからPCM16で送る前提）
      // input_audio_format: "pcm16",
      // サーバVADを使いたいなら（無音検出→自動応答）
      // turn_detection: { type: "server_vad", threshold: 0.5, prefix_padding_ms: 300, silence_duration_ms: 300, create_response: true },
    }),
  });

  const data = await r.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}







