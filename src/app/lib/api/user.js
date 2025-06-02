"use client";

export async function getUser() {
  const response = await fetch(`/api/proxy/getUser`, {
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

export async function updateUser(data) {
  const response = await fetch(`/api/proxy/updateUser`, {
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

export async function addUser({ fullname, email, tipe,status_keanggotaan, password}) {
    let response;
    let responseJson;
    try {
        response = await fetch(`/api/proxy/addUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullname, email, tipe, status_keanggotaan, password }),
        });

        try {
            responseJson = await response.json();
        } catch (jsonError) {
            console.error("Failed to parse JSON response from proxy/addUser:", jsonError);
            const text = await response.text();
            return {
                data: null,
                error: `Server responded with non-JSON or empty body (Status: ${response.status}): ${text.substring(0, 100)}`,
            };
        }

        if (!response.ok) {
            const errorMessage = responseJson.message || responseJson.error || `Error: ${response.status} ${response.statusText}`;
            console.error("addUser API error:", errorMessage, responseJson);
            return { data: null, error: errorMessage };
        }

        // --- BAGIAN PENTING: Mengekstrak ID Pengguna dari Respons ---
        // Ini mencoba mendapatkan ID dari responseJson.data.id atau responseJson.id
        // Sesuaikan ini jika struktur respons dari backend Anda berbeda (misalnya responseJson.user.id)
        const userId = responseJson.data?.id || responseJson.id; 

        if (userId) {
            return { data: userId, error: null }; // Mengembalikan ID pengguna yang berhasil dibuat
        } else {
            console.error("addUser: User added successfully, but no ID found in proxy response data:", responseJson);
            return { data: null, error: "User created, but ID not found in response." };
        }
    } catch (networkError) {
        console.error("Network or unexpected error in addUser:", networkError);
        return { data: null, error: `Network error: ${networkError.message}` };
    }
}

export async function deleteUser(id) {
    const response = await fetch(
    `/api/proxy/deleteUser?id_user=${id}`,
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