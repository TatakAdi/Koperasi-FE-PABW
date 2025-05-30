"use client";

export async function getPayment() {
  const response = await fetch(`/api/proxy/getPayment`, {
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

export async function postPaymentMember(user_id, payment_method, amount){
  const response = await fetch(`/api/proxy/postPaymentMember`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id,
      payment_method,
      amount,
    }),
  });

  const responseJson = await response.json();

  if (response.status !== 200) {
    console.error(responseJson.message);
    return { error: true, data: null, status: response.status };
  }

  return { error: false, data: responseJson.data, status: response.status };
}