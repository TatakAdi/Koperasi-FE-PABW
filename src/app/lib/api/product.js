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

export async function updateProduct(id, data) {
  const response = await fetch(`/api/proxy/updateProduct?id=${id}`, {
    method: "PUT",
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
  const response = await fetch(`/api/proxy/deleteProduct?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseJson = await response.json();

  if (response.status !== 200) {
    console.error("Error caught: ", responseJson.message);
    return { error: true, data: null, status: response.status };
  }

  console.log("User berhasil dihapus");
  return { error: false, data: responseJson.data, status: response.status };
}

export async function addProduct({
  name,
  price,
  stock,
  category,
  description,
  image_url,
}) {
  let response;
  let responseJson;
  try {
    response = await fetch(`/api/proxy/addProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        stock,
        category,
        description,
        image_url,
      }),
    });

    try {
      responseJson = await response.json();
    } catch (jsonError) {
      console.error(
        "Failed to parse JSON response from proxy/addUser:",
        jsonError
      );
      const text = await response.text();
      return {
        data: null,
        error: `Server responded with non-JSON or empty body (Status: ${
          response.status
        }): ${text.substring(0, 100)}`,
      };
    }

    if (!response.ok) {
      const errorMessage =
        responseJson.message ||
        responseJson.error ||
        `Error: ${response.status} ${response.statusText}`;
      console.error("addUser API error:", errorMessage, responseJson);
      return { data: null, error: errorMessage };
    }
    const userId = responseJson.data?.id || responseJson.id;
  } catch (networkError) {
    console.error("Network or unexpected error in addProduct:", networkError);
    return { data: null, error: `Network error: ${networkError.message}` };
  }
}
