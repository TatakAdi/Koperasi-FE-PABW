"use client";

export async function addCartItem(userId, productId, { jumlah }) {
  const response = await fetch(
    `/api/proxy/addCartProduct?id_user=${userId}&id_product=${productId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jumlah }),
    }
  );

  const responseJson = await response.json();

  if (response.status !== 200) {
    console.error("Error caught: ", responseJson.message);
    return { error: true, data: null, status: response.status };
  }

  console.log("Produk berhasil ditambahkan ke keranjang");
  return { error: false, data: responseJson.data, status: response.status };
}

export async function getCartItems(userId) {
  const response = await fetch(`/api/proxy/getCart?id_user=${userId}`, {
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

  console.log(responseJson);
  return { error: false, data: responseJson, status: response.status };
}

export async function getAllCart() {
  const response = await fetch(`/api/proxy/getAllCart`, {
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

  console.log(responseJson);
  return { error: false, data: responseJson, status: response.status };
}

export async function deleteCartItem(userId, productId) {
  const response = await fetch(
    `/api/proxy/deleteCart?id_user=${userId}&id_product=${productId}`,
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

  console.log("Produk berhasil dihapus dari keranjang");
  return { error: false, data: responseJson.data, status: response.status };
}

export async function updateCartItem(userId, productId, { jumlah }) {
  const response = await fetch(
    `/api/proxy/updateCartProduct?id_user=${userId}&id_product=${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jumlah }),
    }
  );

  const responseJson = await response.json();

  if (response.status !== 200) {
    console.error("Error caught: ", responseJson.message);
    return { error: true, data: null, status: response.status };
  }

  console.log("Produk berhasil diperbarui di keranjang");
  return { error: false, data: responseJson.data, status: response.status };
}

export async function updateCartStatus(userId, status) {
  console.log('Updating cart status:', { userId, status });
  
  const response = await fetch(
    `/api/proxy/updateCartStatus?id_user=${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ status }),
      credentials: 'include',
    }
  );

  const responseJson = await response.json();

  if (!response.ok) {
    console.error("Error updating cart status:", responseJson.message);
    return { 
      error: true, 
      message: responseJson.message, 
      status: response.status
    };
  }

  return { 
    error: false, 
    data: responseJson.cart || responseJson.data,
    status: response.status 
  };
}