// api/token.ts
export const runtime = 'edge';

export async function GET() {
  const resp = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // ✅ Realtime で有効なモデルを指定
      model: "gpt-4o-realtime-mini",
      // Optional: 音声を使うなら有効な voice 名を
      // voice: 'alloy',
      // modalities: ['text','audio'], // 必要なら
    }),
    // Realtime セッションは短寿命。キャッシュさせない
    cache: 'no-store',
  });

  const data = await resp.json();
  return new Response(JSON.stringify(data), {
    status: resp.status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

