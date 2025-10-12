export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return j({ error: "Missing OPENAI_API_KEY" }, 500);

    // ✅ 正しいRealtimeセッション生成API
    const r = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-transcribe", // Whisper対応のリアルタイムモデル
        voice: "none" // 音声応答不要の場合
      })
    });

    const data = await r.json();

    if (!r.ok) {
      return j({ error: data.error || data }, r.status);
    }

    return j(data, 200);
  } catch (e: any) {
    return j({ error: String(e?.message || e) }, 500);
  }
}

function j(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    }
  });
}




