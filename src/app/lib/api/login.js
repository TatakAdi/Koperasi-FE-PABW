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
    alert("Login Gagal");
    console.error(responseJson.message);
    return { error: true, data: null };
  }

  console.log("Headers from /api/proxy/login:");
  for (let pair of response.headers.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }
  return { error: false, data: responseJson };
}

export async function getUserLogged() {
  const response = await fetch(`/api/proxy/user`, {
    credentials: "include",
  });

  if (!response.ok) {
    return { error: true, data: null };
  }

  const data = await response.json();
  return { error: false, data };
}
