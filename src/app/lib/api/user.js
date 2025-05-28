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

export async function addUser({fullname, email, tipe, password = "PABW2025"}) {
  const response = await fetch(`/api/proxy/addUser`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({fullname, email, tipe, password}),
  });

  const responseJson = await response.json();

  if (!response.ok) {
      throw new Error(responseJson.message || 'Gagal menambahkan pengguna');
    }
  return { data: responseJson.data, error: null };
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