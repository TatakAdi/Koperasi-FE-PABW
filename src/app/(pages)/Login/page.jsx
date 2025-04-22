"use client";
import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";
import useInput from "../../hooks/useInput";
import { login } from "../../lib/api/login";

export default function Login() {
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();

  async function onLogin({ email, password }) {
    const { error, data } = await login({ email, password });

    if (error) {
      alert("Login Gagal");
    }
  }

  const onSubmitEventHandler = (event) => {
    event.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="w-full flex justify-center items-center h-screen flex-col gap-13">
      <div className=" w-[420px] h-[394px] grid border-2 p-2 border-black">
        <h2 className="font-semibold text-2xl">Log in to Koperasi</h2>
        <form action="" onSubmit={onSubmitEventHandler}>
          <div className="my-3">
            <EmailInput value={email} onChange={onEmailChange} />
            <PasswordInput
              value={password}
              onChange={onPasswordChange}
              label={"Password"}
            />
            <p className="w-full font-semibold text-[14px] text-right text-[#999999] mt-1.5">
              Forgot Password?
            </p>
          </div>
          <button className="bg-black text-white w-full h-[53px] rounded-xl py-16px cursor-pointer mt-3">
            Log In
          </button>
        </form>
        <h3 className="w-full text-center text-red-400">
          Password you entered is incorrect
        </h3>
      </div>
      <p className="text-[#999999]">
        Don't have an account?{" "}
        <a href="/Register" className="text-black">
          Create one
        </a>
      </p>
    </div>
  );
}
