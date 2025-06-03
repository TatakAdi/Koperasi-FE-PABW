"use client";

export async function cartHistory(userId) {
  const response = await fetch(`api/proxy/cartHistory?id_user=${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseJson = await response.json();
  if (response.status !== 200) {
    console.error(responseJson.message);
    return { errro: true, data: null, status: response.status };
  }

  console.log(responseJson);
  return { error: false, data: responseJson, status: response.status };
}
