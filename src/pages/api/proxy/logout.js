"use server";

export default async function handler(req, res) {
  try {
    const cookies = req.headers.cookie || "";
    const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      res.setHeader(
        "Set-Cookie",
        "TOKENID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT HttpOnly"
      );

      return res.status(200).json({ message: "Logout Berhasil" });
    }

    return res.status(400).json({ message: "Logout Gagal" });
  } catch (error) {
    console.error("Proxy error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
