"use server";

export async function verifyEmail(token) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify/${token}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return {
      succes: true,
      message: data.message,
    };
  } catch (error) {
    return {
      succes: false,
      message: error.message,
    };
  }
}
