"use client";

export async function login({ email, password }) {
  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    }
  );

  const responseJson = await response.json();

  if (response.status !== 200) {
    alert(responseJson.message || "Login Gagal");
    return { error: true, data: null };
  }

  return { error: false, data: responseJson };
}

export async function getUserLogged() {
  const response = await fetch(`${process.env.APP_URL}/user`, {
    credentials: "include",
  });

  const responseJson = await response.json();

  if (responseJson.status !== 200) {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson };
}
