export async function GET(req) {
  try {
    const response = await fetch("http://shortnews.eu-4.evennode.com/news");
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching news:", err);
    return new Response(JSON.stringify({ error: "Cannot fetch news" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
