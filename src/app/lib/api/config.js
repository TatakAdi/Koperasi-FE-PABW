export async function showIuranWajib() {
  try {
    const response = await fetch(`/api/proxy/showIuranWajib`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseJson = await response.json();

    if (response.status !== 200) {
      console.error("Error caught: ", responseJson.message);
      return { error: true, data: null, status: response.status };
    }

    // Return structured response matching backend format
    return {
      error: false,
      data: responseJson,
      status: response.status
    };
  } catch (error) {
    console.error("Error in showIuranWajib:", error);
    return { error: true, data: null, status: 500 };
  }
}

export async function updateIuranWajib(data) {
  const response = await fetch(`/api/proxy/updateIuranWajib`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseJson = await response.json();

  if (response.status !== 200) {
    console.error("Error caught: ", responseJson.message);
    return { error: true, data: null, status: response.status };
  }

  console.log("Iuran wajib berhasil diperbarui");
  return { error: false, data: responseJson.data, status: response.status };
}

