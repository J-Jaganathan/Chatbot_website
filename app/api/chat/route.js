// src/app/api/chat/route.js (server-side)
export async function POST(req) {
  try {
    const body = await req.json();
    const query = body?.query ?? '';

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: "Missing 'query' field" }),
        { status: 400 }
      );
    }

    // Backend URL comes from server env vars (set in .env.local or Vercel dashboard)
    const BACKEND_URL = process.env.BACKEND_URL;

    if (!BACKEND_URL) {
      return new Response(
        JSON.stringify({ error: "Backend URL not configured" }),
        { status: 500 }
      );
    }

    const res = await fetch(`${BACKEND_URL.replace(/\/+$/, '')}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok) {
      if (contentType.includes('application/json')) {
        const data = await res.json();
        return new Response(JSON.stringify(data), { status: 200 });
      } else {
        const txt = await res.text();
        return new Response(JSON.stringify({ answer: txt }), { status: 200 });
      }
    } else {
      const txt = contentType.includes('application/json')
        ? await res.json()
        : await res.text();
      return new Response(JSON.stringify({ error: txt, status: res.status }), { status: 502 });
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Server proxy error: ${err.message}` }),
      { status: 500 }
    );
  }
}
