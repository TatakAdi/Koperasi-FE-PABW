"use server";

export default async function handler(req, res) {
    try {
        const { name, email, password } = req.body;
    
        // Ambil token dari cookie
        const cookies = req.headers.cookie || "";
        const tokenMatch = cookies.match(/TOKENID=([^;]+)/);
        const token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;
    
        if (!token) {
        return res.status(401).json({ message: "No token found" });
        }
    
        const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/admin/user`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({ name, email, password }),
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