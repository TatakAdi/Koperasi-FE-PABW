"use client";
import useInput from "../../hooks/useInput";
import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";
import NameInput from "../../components/NameInput";
import Image from "next/image";
import { useState } from "react";
import { registerPengguna, registerPenitip } from "@/lib/api/register";

export default function Register() {
  const [fullname, onNameChange] = useInput();
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();
  const [confirmPassword, onConfirmPasswordChange] = useInput();
  const [isError, setIsError] = useState(false);

  async function onRegister({ fullname, email, password }) {
    const emailDomain = email.split("@")[1];

    if (password !== confirmPassword) {
      setIsError(true);
      return;
    }

    let error;

    if (emailDomain.endsWith("itk.ac.id")) {
      ({ error } = await registerPengguna({ fullname, email, password }));
    } else {
      ({ error } = await registerPenitip({ fullname, email, password }));
    }

    if (!error) {
      // kalau berhasil, langsung redirect ke halaman Email Verification
      router.push(`/EmailVerif?email=${encodeURIComponent(email)}`);
    }
  }

  const onSubmitEventHandler = (event) => {
    event.preventDefault();
    onRegister({ fullname, email, password });
  };

  return (
    <div className="w-full flex justify-center items-center h-screen flex-col gap-13">
      <div className=" w-[420px] h-[500px] grid p-2 ">
        <div className="w-[44px] h-[44px] relative mb-4">
          <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
        </div>
        <h2 className="font-semibold text-2xl">Register New Account</h2>
        <form action="" onSubmit={onSubmitEventHandler}>
          <div className="my-3 flex flex-col gap-1.5">
            <NameInput name={fullname} onNameChange={onNameChange} />
            <EmailInput email={email} onEmailChange={onEmailChange} />
            <PasswordInput
              password={password}
              onPasswordChange={onPasswordChange}
              label={"Password"}
            />
            <p className="text-[#999999] font-light text-sm">
              Note: Password must contain at least 8 characters
            </p>
            <PasswordInput
              password={confirmPassword}
              onPasswordChange={onConfirmPasswordChange}
              label={"Confirm Password"}
            />
          </div>
          <button className="bg-black text-white w-full h-[53px] rounded-xl py-16px cursor-pointer mt-3">
            Create Account
          </button>
        </form>
        <h3
          className={`w-full text-center text-red-400  ${
            isError ? "visible" : "hidden"
          } mt-2`}
        >
          The password you entered do not match
        </h3>
      </div>
      <p className="text-[#999999] mt-3">
        Already have an account?{" "}
        <a href="/Login" className="text-black hover:underline">
          Log in!
        </a>
      </p>
    </div>
  );
}
