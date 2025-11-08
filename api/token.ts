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
      output_audio_format: "pcm16",
      input_audio_format: "pcm16",

      // ★ これを追加：日本語を固定
      input_audio_transcription: {
        language: "ja"
      }

      // （任意）VADの調整は今のままでOK
      // turn_detection: { type: "server_vad", threshold: 0.5, prefix_padding_ms: 300, silence_duration_ms: 200 }
    }),
  });

  const data = await r.json();
  res.setHeader("Content-Type", "application/json");
  res.status(200).send(JSON.stringify(data));
}
