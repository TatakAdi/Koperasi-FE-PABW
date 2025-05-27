"use client";
import EmailInput from "../../components/inputForm/EmailInput";
import useInput from "app/hooks/useInput";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { reqOTPCode } from "app/lib/api/reqOTPCode";

export default function ForgotPass() {
  const [email, onEmailChange] = useInput();
  const [status, setStatus] = useState("idle"); // 'idle or loading
  const router = useRouter();

  async function emailVerif({ email }) {
    setStatus("loading");
    const { error, data, message } = await reqOTPCode({ email });

    if (!error) {
      sessionStorage.setItem("email", email);
      router.push("/OTPCode");
    } else {
      console.error("Error message:", message);
    }
    setStatus("idle");
  }

  const handleSubmit = (event) => {
    // Simulasi pengiriman kode
    event.preventDefault();
    emailVerif({ email: email });
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-4 bg-white">
      <div className="flex flex-col items-start w-full max-w-[420px]">
        <div className="w-[44px] h-[44px] relative mb-4">
          <Image
            src="/ITKLogo2.svg"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>

        <h2 className="text-[#000] text-[24px] font-semibold font-geist mb-2">
          Password Reset
        </h2>

        <p className="text-[#8F8F8F] text-[16px] font-normal font-geist mb-6">
          Enter your email to receive a verification code.
        </p>

        <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
          <EmailInput email={email} onEmailChange={onEmailChange} />
          <button
            disabled={status === "loading"}
            className=" flex justify-center items-center bg-black text-white w-full h-[53px] rounded-xl py-4 cursor-pointer hover:bg-gray-800 transition-colors"
          >
            {status === "loading" ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              "Send Verivication Code"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
