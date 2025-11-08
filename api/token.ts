// api/token.ts
export default async function handler(req: any, res: any) {
  const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
      "OpenAI-Beta": "realtime=v1",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-realtime-preview",
      modalities: ["audio", "text"],

      // 音声入出力
      input_audio_format: "pcm16",
      output_audio_format: "pcm16",

      // ★ 言語を日本語に固定（精度向上）
      input_audio_transcription: { language: "ja" },

      // ★ これが重要：サーバ側で turn を検出し、自動で response を生成
      turn_detection: {
        type: "server_vad",
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 400,
        create_response: true,          // ← これが無いとテキストが来ません
        interrupt_response: true
      },

      // 任意：軽いプロンプト（語彙誘導したいとき）
      // instructions: "日本語で正確に文字起こししてください。"
    }),
  });

  const data = await r.json();
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(data));
}
