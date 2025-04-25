"use client";
import EmailInput from "../../components/EmailInput";
import useInput from "@/hooks/useInput";
import Image from "next/image";

export default function ForgotPass() {
  const [email, onEmailChange] = useInput();

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-4 bg-white">
      <div className="flex flex-col items-start w-full max-w-[420px]">
        <div className="w-[44px] h-[44px] relative mb-4">
          <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
        </div>

        <h2 className="text-[#000] text-[24px] font-semibold font-geist mb-2">
          Password Reset
        </h2>

        <p className="text-[#8F8F8F] text-[16px] font-normal font-geist mb-6">
          Enter your email to receive a verification code.
        </p>

        <form className="w-full flex flex-col gap-2">
          <EmailInput value={email} onChange={onEmailChange} />
          <button
            type="button"
            className="bg-black text-white w-full h-[53px] rounded-xl py-4 cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Send Verification Code
          </button>
        </form>
      </div>
    </div>
  );
}
