"use client";
import useInput from "@/app/hooks/useInput";
import EmailInput from "../../components/EmailInput";
import PasswordInput from "../../components/PasswordInput";
import NameInput from "@/app/components/NameInput";

export default function Register() {
  const [name, onNameChange] = useInput();
  const [email, onEmailChange] = useInput();
  const [password, onPasswordChange] = useInput();
  const [confirmPassword, onConfirmPasswordChange] = useInput();

  return (
    <div className="w-full flex justify-center items-center h-screen flex-col gap-13">
      <div className=" w-[420px] h-[500px] grid border-2 p-2 border-black">
        <h2 className="font-semibold text-2xl">Register New Account</h2>
        <form action="">
          <div className="my-3 flex flex-col gap-1.5">
            <NameInput name={name} onNameChange={onNameChange} />
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
      </div>
      <p className="text-[#999999]">
        Already have an account?{" "}
        <a href="/Login" className="text-black">
          Log in!
        </a>
      </p>
    </div>
  );
}
