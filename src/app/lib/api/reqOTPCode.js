"use server";

export async function reqOTPCode({ email }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/email/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ email }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    return {
      succes: true,
      error: false,
      message: data.message,
    };
  } catch (error) {
    return {
      succes: false,
      error: true,
      message: error.message,
    };
  }
}
