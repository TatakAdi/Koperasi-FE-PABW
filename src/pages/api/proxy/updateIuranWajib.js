export default async function handler(req, res) {
    try {
        const cookies = req.headers.cookie || "";
        const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
        const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/config/1`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-Requested-With": "XMLHttpRequest",
                },
                body: JSON.stringify(req.body),
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
