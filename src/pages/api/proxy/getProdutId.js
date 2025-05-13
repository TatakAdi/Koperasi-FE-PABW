"use server";

export default async function handler(req, res) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const id = searchParams.get("id");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/product/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
