// api/token.ts  — Edge で動く GET/POST 両対応 & ek を直返し
export const runtime = 'edge';

export async function GET()  { return createSession(); }
export async function POST() { return createSession(); }

async function createSession(): Promise<Response> {
  const r = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'realtime=v1',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-realtime-preview',
      // 受信側の入力フォーマットを固定
      input_audio_format: 'pcm16',
      // ASR は日本語優先（必要に応じて変更）
      input_audio_transcription: { model: 'gpt-4o-transcribe', language: 'ja' },
      // 任意：応答音声を使っていないなら省略可
      output_audio_format: 'pcm16'
    }),
  });

  const data = await r.json();

  if (!r.ok) {
    // クライアントで原因が分かるようエラーをそのまま返す
    return new Response(JSON.stringify({ error: data }), {
      status: r.status, headers: { 'content-type': 'application/json' }
    });
  }

  // ★ モバイルが取りやすいよう top-level に ek を付けて返す
  const ek = data?.client_secret?.value ?? null;
  return new Response(JSON.stringify({ ...data, ek }), {
    headers: { 'content-type': 'application/json' }
  });
}
