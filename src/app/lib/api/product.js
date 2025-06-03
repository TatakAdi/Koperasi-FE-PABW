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

export async function updateProduct(payload) {
  const { id, ...dataToUpdate } = payload;

  if (id === undefined || id === null) {
    console.error(
      "updateProduct: Product ID is undefined or null in payload.",
      payload
    );
    return {
      error: true,
      data: null,
      status: 400,
      message: "Product ID is missing.",
    };
  }

  const response = await fetch(
    `/api/proxy/updateProduct?id=${encodeURIComponent(id)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdate),
    }
  );

  let responseJson;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    responseJson = await response.json();
  } else {
    if (response.status !== 200) {
      console.error(
        "Received non-JSON error response from /api/proxy/updateProduct"
      );
      return {
        error: true,
        data: null,
        status: response.status,
        message: `Server error: ${response.statusText}`,
      };
    }
  }

  if (response.status !== 200) {
    console.error(
      "Error from /api/proxy/updateProduct:",
      responseJson?.message || response.statusText
    );
    return {
      error: true,
      data: null,
      status: response.status,
      message: responseJson?.message || `Error ${response.status}`,
    };
  }

  return { error: false, data: responseJson?.data, status: response.status };
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

export async function addProduct(payload) {
  let fetchAPIResponse;
  let responseJson;

  console.log("[API Client - addProduct] Mengirim payload:", payload);

  const finalPayload = { ...payload };
  if (finalPayload.image_url && finalPayload.image_url instanceof File) {
    console.warn(
      "[API Client addProduct] image_url in payload is a File object. This won't be uploaded correctly via JSON API. Sending its name as placeholder for 'image_url'."
    );
    finalPayload.image_url = `file_placeholder:${finalPayload.image_url.name}`;
  }

  try {
    fetchAPIResponse = await fetch(`/api/proxy/addProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalPayload),
    });

    const contentType = fetchAPIResponse.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        responseJson = await fetchAPIResponse.json();
      } catch (jsonError) {
        console.error("[API Client - addProduct] Gagal parse JSON:", jsonError);
        const rawText = await fetchAPIResponse
          .text()
          .catch(() => "Could not read response text");
        if (!fetchAPIResponse.ok) {
          return {
            error: `Server error (Status: ${
              fetchAPIResponse.status
            }), failed to parse JSON response. Details: ${rawText.substring(
              0,
              100
            )}`,
            data: null,
            status: fetchAPIResponse.status,
          };
        }

        return {
          error: "Gagal memproses respons server (JSON tidak valid).",
          data: null,
          status: fetchAPIResponse.status,
        };
      }
    } else if (!fetchAPIResponse.ok) {
      const errorText = await fetchAPIResponse
        .text()
        .catch(() => `Error ${fetchAPIResponse.statusText}`);
      console.error(
        "[API Client - addProduct] Error API (non-JSON):",
        errorText,
        "Status:",
        fetchAPIResponse.status
      );
      return {
        data: null,
        error: errorText || `Error HTTP: ${fetchAPIResponse.status}`,
        status: fetchAPIResponse.status,
      };
    } else if (fetchAPIResponse.ok && fetchAPIResponse.status === 204) {
      return {
        error: false,
        data: null,
        status: fetchAPIResponse.status,
        message: "Produk berhasil ditambahkan (No Content).",
      };
    }

    if (!fetchAPIResponse.ok) {
      const errorMessage =
        responseJson?.message ||
        responseJson?.error ||
        `Error: ${fetchAPIResponse.status} ${fetchAPIResponse.statusText}`;
      console.error(
        "[API Client - addProduct] Error API dari proxy:",
        errorMessage,
        responseJson
      );
      return {
        data: null,
        error: errorMessage,
        status: fetchAPIResponse.status,
      };
    }

    console.log(
      "[API Client - addProduct] Produk berhasil ditambahkan, respons proxy:",
      responseJson
    );
    return {
      error: false,
      data: responseJson?.data || responseJson,
      status: fetchAPIResponse.status,
      message: responseJson?.message || "Produk berhasil ditambahkan.",
    };
  } catch (networkError) {
    console.error("[API Client - addProduct] Network error:", networkError);
    return {
      data: null,
      error: `Network error: ${networkError.message}`,
      status: 0,
    };
  }
}
