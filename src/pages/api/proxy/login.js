export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const csrf = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/sanctum/csrf-cookie`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify(req.body),
      }
    );

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    const contentType = response.headers.get("Content-Type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await loginRes.text();
      console.error("Non-JSON response:", text);
      return res
        .status(500)
        .json({ message: "Expected JSON, got HTML", raw: text });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
