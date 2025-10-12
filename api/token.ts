// api/token.ts
export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) return j({ error: "Missing OPENAI_API_KEY" }, 500);

    // Whisper Realtimeセッションの作成
    // ✅ modelパラメータを削除し、Whisper専用エンドポイントに変更
    const r = await fetch("https://api.openai.com/v1/realtime?model=gpt-4o-mini-transcribe", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // 必要に応じてパラメータを追加可能
        voice: "none"
      })
    });

    if (!r.ok) {
      const text = await r.text();
      return j({ error: `Upstream ${r.status}: ${text}` }, r.status);
    }

    const data = await r.json();
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


