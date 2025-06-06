import useShow from "../hooks/useShow";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  onPasswordChange,
  password,
  label,
  isError,
}) {
  const [showPassword, togglePasswordVisibility] = useShow();

  return (
    <>
      <label htmlFor="password">{label}</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={`block bg-[#F2F5F7] w-full h-[48px] rounded-xl py-[12px] pr-[12px] pl-[16px] ${
            isError ? "border-2 border-red-400 " : null
          } `}
          value={password}
          onChange={onPasswordChange}
          placeholder="password123"
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
        >
          {showPassword ? <Eye /> : <EyeOff />}
        </button>
      </div>
    </>
  );
}
