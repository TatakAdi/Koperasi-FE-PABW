"use client";
import { useState } from "react";
import Image from "next/image";
import PasswordInput from "../../components/PasswordInput";

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");

  const handleSetPassword = () => {
    if (newPassword !== repeatPassword) {
      setError("The passwords you entered do not match");
    } else if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
    } else {
      setError("");
      // TODO: Kirim password ke backend di sini
      console.log("Password set successfully!");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-4 bg-white">
      <div className="flex flex-col items-start w-full max-w-[420px]">
      <div className="w-[44px] aspect-square relative mb-4">
        <Image 
            src="/logo.svg" 
            alt="Logo" 
            fill 
            className="object-contain" 
        />
      </div>


      <h2 className="text-black text-[24px] font-semibold font-[Geist] leading-none mb-2">
        Set a New Password
      </h2>


      <p className="text-[#8F8F8F] text-[16px] font-normal font-[Geist] leading-none mb-6">
        Your new password must be different from your previous ones.
      </p>


        <div className="w-full flex flex-col gap-4">
          <div>
            <label className="text-black font-geist mb-1 block">New Password</label>
            <PasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <p className="text-sm text-gray-500 mt-1">
              Note: Password must contain at least 8 characters
            </p>
          </div>

          <div>
            <label className="text-black font-geist mb-1 block">New Password (Repeat)</label>
            <PasswordInput
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              placeholder="Repeat new password"
            />
          </div>

          <button
            type="button"
            onClick={handleSetPassword}
            className="bg-black text-white w-full h-[53px] rounded-xl py-4 hover:bg-gray-800 transition-colors"
          >
            Set Password
          </button>

          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
