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

export async function postPaymentMember({ user_id, payment_method, amount }) { // <-- Changed to destructure an object
  let response; // Declare response outside try-catch to access it later
  let responseJson; // Declare responseJson outside try-catch

  try {
    response = await fetch(`/api/proxy/postPaymentMember`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ // This is now correct, directly uses destructured values
        user_id,
        payment_method,
        amount,
      }),
    });

    // Always try to parse JSON, even if the response is not OK.
    // This allows us to get detailed error messages from the backend.
    try {
        responseJson = await response.json();
    } catch (jsonError) {
        console.error("Failed to parse JSON response from proxy/postPaymentMember:", jsonError);
        const text = await response.text(); // Get raw text if not JSON
        return {
            error: `Server responded with non-JSON or empty body (Status: ${response.status}): ${text.substring(0, 100)}`,
            data: null,
            status: response.status // Pass status for better debugging
        };
    }

    if (!response.ok) {
        // Return the full error object from the backend, not just 'true'
        const errorMessage = responseJson.message || responseJson.errors || `Error: ${response.status} ${response.statusText}`;
        console.error("postPaymentMember API error:", errorMessage, responseJson);
        return { error: errorMessage, data: null, status: response.status };
    }

    return { error: false, data: responseJson.data, status: response.status };

  } catch (networkError) {
    // This catches network issues or issues before the fetch completes
    console.error("Network or unexpected error in postPaymentMember:", networkError);
    return { error: `Network error: ${networkError.message}`, data: null, status: 500 }; // Generic 500 for network issues
  }
}