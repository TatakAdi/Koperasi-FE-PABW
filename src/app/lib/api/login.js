"use client";

export async function login({ email, password }) {
  const response = await fetch(`/api/proxy/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const responseJson = await response.json();

  if (response.status !== 200) {
    alert(responseJson.message || "Login Gagal");
    console.error(responseJson.message);
    return { error: true, data: null };
  }

  return { error: false, data: responseJson };
}

export async function getUserLogged() {
  const response = await fetch(`/api/proxy/user`, {
    credentials: "include",
  });

  const responseJson = await response.json();

  if (response.status !== 200) {
    return { error: true, data: null };
  }

  return { error: false, data: responseJson };
}
