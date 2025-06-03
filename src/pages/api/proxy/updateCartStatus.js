export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  try {
    const id_user = req.query.id_user;
    const { status } = req.body;
    const tokenId = req.cookies?.TOKENID;

    if (!id_user) {
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log(`Updating cart status for user ${id_user} to: ${status}`);
    const url = `${apiUrl}/api/cart/${id_user}/status`;
    console.log(`API URL: ${url}`);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${tokenId}`,
      },
      body: JSON.stringify({ status }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error response:', data);
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      details: error.message 
    });
  }
}