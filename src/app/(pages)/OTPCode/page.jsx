"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EmailVerif() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const router = useRouter();

  const handleSubmit = async () => {
    const finalCode = code.join("");
    setLoading(true);
    setError("");

    // Simulasi API call
    setTimeout(() => {
      if (finalCode === "123456") {
        console.log("Kode benar:", finalCode);
        router.push("/SetNewPW");
      } else {
        setError("Invalid code. Please try again");
      }
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (code.every((val) => val !== "")) {
      handleSubmit();
    }
  }, [code]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // hanya angka 0-9 atau kosong

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-4 bg-white">
      <div className="flex flex-col items-start w-full max-w-[420px]">
        <div className="w-[44px] h-[44px] relative mb-4">
          <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
        </div>

        <h2 className="text-black text-[24px] font-semibold font-geist mb-1">
          Email Verification
        </h2>

        <p className="text-[#8F8F8F] text-[16px] font-normal font-geist mb-6">
          We’ve sent a code to <span className="text-black">starnig@star.com</span>
        </p>

        <div className="flex gap-3 items-center mb-4">
          {code.map((value, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(e.target.value, index)}
              className="flex w-[48px] h-[64px] justify-center items-center text-[24px] text-black text-center rounded-xl border border-gray-200 bg-gray-100 outline-none focus:ring-2 focus:ring-black"
            />
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 text-red-600 text-sm mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0ZM9 6a1 1 0 1 1 2 0v4a1 1 0 0 1-2 0V6Zm1 8a1.25 1.25 0 1 0 0-2.5A1.25 1.25 0 0 0 10 14Z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <p className="text-gray-600 text-sm mb-2">Checking your code...</p>
        )}

        <p className="text-[#8F8F8F] text-[14px] mt-2">
          Can’t find your code? Check your spam folder. <br />
          Haven’t received the code?{" "}
          <span className="text-black font-medium cursor-pointer">Get a new code</span>
        </p>
      </div>
    </div>
  );
}
