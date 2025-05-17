"use client";

export async function changePassword({ email, password }) {
  const response = await fetch(`/api/proxy/changePassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      new_password: password,
      new_password_confirmation: password,
    }),
  });

  const responseJson = await response.json();

  if (response.status !== 200) {
    console.error("error caught : ", responseJson.message);
    return {
      error: true,
      data: null,
      status: response.status,
      message: responseJson.error,
    };
  }

  console.log("Password berhasil diubah");
  return { error: false, data: responseJson.data, status: response.status };
}
