"use client";
export async function getCategory() {
  const response = await fetch(`/api/proxy/getCategory`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseJson = await response.json();

  if (response.status !== 200) {
    console.error(responseJson.message);
    return { error: true, data: null, status: response.status };
  }

  return { error: false, data: responseJson.data, status: response.status };
}