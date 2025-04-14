import useShow from "@/app/hooks/useShow";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ onPasswordChange, password }) {
  const [showPassword, togglePasswordVisibility] = useShow();

  return (
    <>
      <label htmlFor="password">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          className="block bg-[#F2F5F7] w-full h-[48px] rounded-xl py-[12px] pr-[12px] pl-[16px]"
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
