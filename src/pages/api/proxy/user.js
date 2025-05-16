export default async function handler(req, res) {
  console.log("Cookie masuk FE:", req.headers.cookie);
  try {
    // Mengencode token buat bandingin di BE
    const cookies = req.headers.cookie || "";
    const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/user`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: data.message || "Unauthoarized" });
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
