"use client";
export async function registerPengguna({ fullname, email, password }) {
  const response = await fetch(`/api/proxy/registerPengguna`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify({
      fullname,
      email,
      password,
      password_confirmation: password,
    }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    console.error(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

export async function registerPenitip({ fullname, email, password }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/proxy/registerPenitip`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        fullname,
        email,
        password,
        password_confirmation: password,
      }),
    }
  );

  const responseJson = await response.json();

  if (!response.ok) {
    console.error(responseJson.message);
    return { error: true };
  }

  return { error: false };
}
