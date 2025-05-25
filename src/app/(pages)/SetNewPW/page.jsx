"use client";
import { useState } from "react";
import { changePassword } from "@/lib/api/changePassword";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PasswordInput from "@/components/inputForm/PasswordInput";
import useInput from "@/hooks/useInput";

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useInput();
  const [repeatPassword, setRepeatPassword] = useInput();
  const [isLoading, setIsLoading] = useState(false);
  const email = sessionStorage.getItem("email");
  const [errorClient, setError] = useState("");
  const router = useRouter();

  const handleSetPassword = async () => {
    if (newPassword !== repeatPassword) {
      setError("The passwords you entered do not match");
      return;
    } else if (newPassword.length < 6) {
      setError("Password must be at least 8 characters long");
      return;
    }
    setError("");
    setIsLoading(true);
    // TODO: Kirim password ke backend di sini
    const { error, data, status, message } = await changePassword({
      email,
      password: newPassword,
    });

    if (error) {
      setError(message || "Something went wrong");
      return;
    }
    console.log("Password set successfully!");
    setIsLoading(false);
    sessionStorage.removeItem("email");
    router.push("/Login");
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    handleSetPassword({ email, password: newPassword });
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center p-4 bg-white">
      <div className="flex flex-col items-start w-full max-w-[420px]">
        <div className="w-[44px] aspect-square relative mb-4">
          <Image
            src="/ITKLogo2.svg"
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

        <form className="w-full flex flex-col gap-4" onSubmit={onSubmitHandler}>
          <div>
            <label className="text-black font-geist mb-1 block">
              New Password
            </label>
            <PasswordInput
              password={newPassword}
              onPasswordChange={setNewPassword}
              placeholder="Enter new password"
            />
            <p className="text-sm text-gray-500 mt-1">
              Note: Password must contain at least 8 characters
            </p>
          </div>

          <div>
            <label className="text-black font-geist mb-1 block">
              New Password (Repeat)
            </label>
            <PasswordInput
              password={repeatPassword}
              onPasswordChange={setRepeatPassword}
              placeholder="Repeat new password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`flex justify-center items-center bg-black text-white w-full h-[53px] rounded-xl py-4 hover:bg-gray-800 transition-colors ${
              !isLoading ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            {!isLoading ? (
              "Set Password"
            ) : (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            )}
          </button>

          {errorClient && (
            <p className="text-red-600 text-sm mt-2 text-center">
              {errorClient}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
