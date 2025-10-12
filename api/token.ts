export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 500 });
  }

  const r = await fetch("https://api.openai.com/v1/realtime/transcription_sessions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-transcribe"
    })
  });

  if (!r.ok) {
    const txt = await r.text();
    return new Response(JSON.stringify({ error: txt }), { status: r.status });
  }

  const data = await r.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
