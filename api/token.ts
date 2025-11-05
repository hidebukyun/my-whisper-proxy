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
        // Realtime本体
        model: "gpt-4o-mini-realtime-preview",

        // 入力はPCM16(16k/mono)で受け取る（文字列で指定！）
        input_audio_format: "pcm16",

        // ✅ 入力音声の文字起こしを有効化（ここが重要）
        //   gpt-4o-mini-transcribe か gpt-4o-transcribe が使用可能です
        input_audio_transcription: { model: "gpt-4o-mini-transcribe" },

        // 文字だけで十分。音声応答は不要
        modalities: ["text"],

        // ✅ サーバVADは使っても良いが、応答は作らせない
        //    「入力→ASRのみ」を狙う
        turn_detection: { type: "server_vad", create_response: false },

        // 念のため応答オーディオ関連は外す／指定しない
        // output_audio_format: undefined,
      }),
    });

    const text = await r.text();
    res.status(r.status).setHeader("content-type", "application/json").send(text);
  } catch (e: any) {
    res.status(500).send(e?.message ?? "proxy error");
  }
}
