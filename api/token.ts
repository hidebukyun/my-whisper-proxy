// api/token.ts
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
        modalities: ["audio", "text"],

        // 入力／出力フォーマット
        input_audio_format: "pcm16",
        output_audio_format: "pcm16",

        // ✅ 修正ポイント：model と language の両方を指定！
        input_audio_transcription: {
          model: "gpt-4o-mini-transcribe",
          language: "ja",
        },

        // サーバ側で音声区切りを検出し、文字起こしレスポンスを自動生成
        turn_detection: {
          type: "server_vad",
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 400,
          create_response: true,
          interrupt_response: true,
        },

        // 任意の補足（指示プロンプトとして扱われる）
        instructions: "日本語音声を正確に文字起こししてください。",
      }),
    });

    const text = await r.text();
    res.status(r.status)
      .setHeader("content-type", "application/json")
      .send(text);

  } catch (e: any) {
    res.status(500).send(e?.message ?? "proxy error");
  }
}
