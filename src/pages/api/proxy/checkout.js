"use server";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method are not allowed" });
  }

  const cookies = req.headers.cookie || "";
  const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
  const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/pay-for-cart`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();

    return res.status(201).json({
      message: "Checkout telah berhasil, menunggu proses selanjutnya",
      data,
    });
  } catch (error) {
    console.error("Internal server error: ", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
}
