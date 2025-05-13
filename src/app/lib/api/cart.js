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
