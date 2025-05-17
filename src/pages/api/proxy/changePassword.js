"use server";

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/email/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(req.body),
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
