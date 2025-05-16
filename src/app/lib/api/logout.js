"use client";

import Cookies from "js-cookie";

export async function logout() {
  const response = await fetch(`/api/proxy/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    Cookies.remove("TOKENID");
    window.location.reload();
  } else {
    console.error("Logout gagal");
  }
}
