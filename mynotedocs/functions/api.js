let notes = [
  { key: "first", value: "This is my first note" },
  { key: "second", value: "Another example note" },
  { key: "third", value: "Node backend deployed" },
];

exports.handler = async (event) => {
  const path = event.path;
  const method = event.httpMethod;

  // GET /api/all
  if (method === "GET" && path.endsWith("/all")) {
    return {
      statusCode: 200,
      body: JSON.stringify(notes),
      headers: { "Content-Type": "application/json" },
    };
  }

  // GET /api/search?q=keyword
  if (method === "GET" && path.includes("/search")) {
    const q = event.queryStringParameters.q?.toLowerCase() || "";
    const filtered = notes.filter(
      (n) => n.key.toLowerCase().includes(q) || n.value.toLowerCase().includes(q)
    );
    return {
      statusCode: 200,
      body: JSON.stringify(filtered),
      headers: { "Content-Type": "application/json" },
    };
  }

  // POST /api/add with JSON { key: "...", value: "..." }
  if (method === "POST" && path.endsWith("/add")) {
    try {
      const body = JSON.parse(event.body || "{}");
      if (!body.key || !body.value) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "key and value are required" }),
        };
      }
      notes.push({ key: body.key, value: body.value });
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Note added", notes }),
        headers: { "Content-Type": "application/json" },
      };
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON" }),
      };
    }
  }

  // default
  return {
    statusCode: 404,
    body: "Not found",
  };
};
