export default async function handler(req, res) {
  try {
    const { symbol } = req.query;
    if (!symbol) return res.status(400).json({ error: "Missing query param: symbol" });

    const apikey = process.env.ALPHAVANTAGE_API_KEY || "B2BV6YSCV0YZ3ROZ";
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(symbol)}&datatype=json&apikey=${apikey}`;

    const upstream = await fetch(url, { headers: { "User-Agent": "custom-gpt-proxy" } });
    const text = await upstream.text();

    try {
      const data = JSON.parse(text);
      return res.status(upstream.ok ? 200 : upstream.status).json(data);
    } catch {
      return res.status(upstream.status || 502).json({ error: "Upstream non-JSON", status: upstream.status, body: text });
    }
  } catch (e) {
    return res.status(502).json({ error: "Proxy error", details: String(e) });
  }
}
