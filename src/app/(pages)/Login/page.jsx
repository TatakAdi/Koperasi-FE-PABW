"use client";
import { useRouter } from "next/navigation";
import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";
import useInput from "../../hooks/useInput";
import { login } from "../../lib/api/login";
import { useState } from "react";
import Image from "next/image";

export default function Login() {
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  async function onLogin({ email, password }) {
    const { error } = await login({ email, password });

    if (error) {
      setIsError(true);
    } else {
      router.push("/");
    }
  }

  const onSubmitEventHandler = (event) => {
    event.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="w-full flex justify-center items-center h-screen flex-col gap-13">
      <div className=" w-[420px] h-[400px]  p-2 ">
        <div>
          <div className="w-[44px] h-[44px] relative mb-4">
            <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
          </div>
          <h2 className="font-semibold text-2xl">Log in to Koperasi</h2>
        </div>
        <form action="" onSubmit={onSubmitEventHandler}>
          <div className="my-3 grid gap-1">
            <EmailInput email={email} onEmailChange={onEmailChange} />
            <PasswordInput
              password={password}
              onPasswordChange={onPasswordChange}
              label={"Password"}
              isError={isError}
            />
            <p className="w-full font-semibold text-[14px] text-right text-[#999999] mt-1.5">
              <a
                href="/ForgotPass"
                className="text-[#999999] hover:text-red-500 transition-colors"
              >
                Forgot Password?
              </a>
            </p>
          </div>
          <button className="bg-black text-white w-full h-[53px] rounded-xl py-16px cursor-pointer mt-3">
            Log In
          </button>
        </form>

        <h3
          className={`w-full text-center text-red-400  ${
            isError ? "visible" : "hidden"
          } mt-2`}
        >
          Password you entered is incorrect
        </h3>
      </div>
      <p className="text-[#999999]">
        Don't have an account?{" "}
        <a href="/Register" className="text-black hover:underline">
          Create one
        </a>
      </p>
    </div>
  );
}
