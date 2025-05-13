"use server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const userId = searchParams.get("id_user");
  const productId = searchParams.get("id_product");

  try {
    // Mengencode token buat bandingin di BE
    const cookies = req.headers.cookie || "";
    const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
    const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/cart/${userId}/product/${productId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(req.body),
      }
    );

    // if (!response.ok) {
    //   console.log(res.json({ message: data.message }));
    //   return res
    //     .status(response.status)
    //     .json({ message: data.message || "Unauthoarized" });
    // }

    const data = await response.json();
    console.log(data);
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
