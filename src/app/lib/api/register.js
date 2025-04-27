export async function registerPengguna({ fullname, email, password }) {
  const response = await fetch(`/api/auth/register/pengguna`, {
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

  if (responseJson.status !== "success") {
    console.error(responseJson.message);
    return { error: true };
  }

  return { error: false };
}

export async function registerPenitip({ fullname, email, password }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register/penitip`,
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

  if (responseJson.status !== "success") {
    console.error(responseJson.message);
    return { error: true };
  }

  return { error: false };
}
