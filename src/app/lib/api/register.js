"use server";

export default async function register({ fullname, email, password }) {
  const response = await fetch(`${process.env.APP_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullname, email, password }),
  });

  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    alert(responseJson.message);
    return { error: true };
  }

  return { error: false };
}
