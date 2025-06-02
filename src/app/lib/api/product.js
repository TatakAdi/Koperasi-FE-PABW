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

export async function updateProduct(data) {
  const response = await fetch(`/api/proxy/updateProduct`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseJson = await response.json();

  if (response.status !== 200) {
    console.error(responseJson.message);
    return { error: true, data: null, status: response.status };
  }

  return { error: false, data: responseJson.data, status: response.status };
}

export async function deleteProduct(id) {
    const response = await fetch(
    `/api/proxy/deleteProduct?id=${id}`,
    {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        },
    }
    );

    const responseJson = await response.json();

    if (response.status !== 200) {
    console.error("Error caught: ", responseJson.message);
    return { error: true, data: null, status: response.status };
    }

    console.log("User berhasil dihapus");
    return { error: false, data: responseJson.data, status: response.status };
}
