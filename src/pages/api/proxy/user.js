export default async function handler(req, res) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user`, {
    headers: {
      Cookie: req.headers.cookie || "",
    },
    credentials: "include",
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
