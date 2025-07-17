// Simple in-memory notes
let notes = [
  { key: "javascript", value: "A programming language primarily used on the web" },
  { key: "springboot", value: "Java framework for building APIs" },
  { key: "nodejs", value: "Runtime for building backend APIs in JS" },
  { key: "netlify", value: "A platform for deploying frontends and functions" },
  { key: "search", value: "Find notes by matching keywords" }
];

exports.handler = async (event, context) => {
  const { httpMethod, path } = event;

  // Search notes
  if (httpMethod === "GET" && path.endsWith("/search")) {
    const query = (event.queryStringParameters.q || "").toLowerCase();
    const results = notes.filter(
      n => n.key.toLowerCase().includes(query) || n.value.toLowerCase().includes(query)
    );
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results })
    };
  }

  // Add new note
  if (httpMethod === "POST" && path.endsWith("/add")) {
    const body = JSON.parse(event.body || "{}");
    if (!body.key || !body.value) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "key and value required" })
      };
    }
    notes.push({ key: body.key, value: body.value });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Added", notes })
    };
  }

  // Fallback
  return { statusCode: 404, body: "Not found" };
};
