"use client";
export async function getProduct() {
  const response = await fetch(`/api/proxy/getProduct`, {
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

export async function getProductId(id) {
  const response = await fetch(`/api/proxy/getProductId?id=${id}`, {
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

  console.log(responseJson.data);
  return { error: false, data: responseJson.data, status: response.status };
}
