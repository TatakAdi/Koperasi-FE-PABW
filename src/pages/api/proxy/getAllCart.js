"use server";

export default async function handler(req, res) {
  try {
    // Ambil token dari cookie (sama seperti addCartProduct)
    const cookies = req.headers.cookie || "";
    const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/cart`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}