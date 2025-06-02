// "use server";

// export async function confirmPayment({ method, total }) {
//   const response = await fetch('/api/payment/confirm', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ method, total }),
//   });
//   if (!response.ok) throw new Error('Payment failed');
//   return response.json();
// }


"use server";

export default async function handler(req, res) {
    console.log("Cookie masuk FE:", req.headers.cookie);
    try {
        const cookies = req.headers.cookie || "";
        const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
        const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        // Forward the request body from the frontend
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/pay-for-cart`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify(req.body), // <-- forward the body
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