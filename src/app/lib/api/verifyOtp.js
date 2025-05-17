"use server";

export async function verifyOtp({ email, otp }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/email/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Verification failed" };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, error: "Something went wrong, error:", error };
  }
}
