"use server";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method are not allowed" });
  }

  try {
    const { id_user } = req.query;

    const cookies = req.headers.cookie || "";
    const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/cart/${id_user}/history`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Internal server error: ", error);
    res.status(500).json({ message: "Internal server error", error });
  }
}
