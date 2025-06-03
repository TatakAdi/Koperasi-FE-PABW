export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: "Product ID is missing in query parameters." });
    }

    const cookies = req.headers.cookie || "";
    const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token not found." });
    }

    const backendUrl = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/api/product/${encodeURIComponent(id)}`;

    const backendResponse = await fetch(backendUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
      },
      body: JSON.stringify(updateData),
    });

    let backendData;
    try {
      backendData = await backendResponse.json();
    } catch (e) {
      if (!backendResponse.ok) {
        const rawText = await backendResponse.text();
        console.error("Backend raw error response:", rawText);
      }

      if (!backendResponse.ok) {
        return res
          .status(backendResponse.status)
          .json({
            message: "Error from backend, non-JSON response",
            details: rawText,
          });
      }
    }

    res.status(backendResponse.status).json(backendData);
  } catch (error) {
    console.error("Proxy error in updateProduct handler:", error);
    res
      .status(500)
      .json({
        message: "Internal Server Error in proxy",
        error: error.message,
      });
  }
}
