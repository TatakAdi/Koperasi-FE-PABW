export default async function handler(req, res) {
  console.log("Cookie masuk FE:", req.headers.cookie);
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/user`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Cookie: req.headers.cookie,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ message: "Unauthoarized" });
    }

    // const contentType = response.headers.get("content-type");

    // if (!contentType || !contentType.includes("application/json")) {
    //   const raw = await response.text();
    //   console.error("Expected JSON, but got HTML instead:\n", raw);
    //   return res.status(500).json({
    //     message: "Expected JSON but got HTML",
    //     raw,
    //   });
    // }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
