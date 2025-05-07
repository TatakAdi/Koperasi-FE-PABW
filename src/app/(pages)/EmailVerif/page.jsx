"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function EmailVerif() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  const handleSubmit = () => {
    const finalCode = code.join("");
    console.log("Request submitted with codes:", finalCode);
    // Lakukan API request di sini jika diperlukan
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

    // Auto move to next input
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

        {loading && (
          <p className="text-black text-sm mb-2">Checking your code...</p>
        )}

        {error && (
          <p className="text-red-600 text-sm mb-2">{error}</p>
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
