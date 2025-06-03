"use client";

export async function checkout({ cart_id, items, payment_method }) {
  try {
    const response = await fetch(`api/proxy/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart_id, items, payment_method }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Terjadi kesalahan", data: null };
    }

    console.log("Payload yang dikirim ke BE: ", {
      cart_id,
      items,
      payment_method,
    });
    console.log("Response dari backend: ", data);
    return { error: null, data };
  } catch (error) {
    console.error("Gagal melakukan checkout barang, error: ", error);
    return { error: error.message, data: null };
  }
}
