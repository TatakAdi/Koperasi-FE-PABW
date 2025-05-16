import React from "react";
import { useRouter } from "next/navigation";

export default function ProfilePicMenu({ roles, authed, logout }) {
  const router = useRouter();

  const styleBox =
    "text-sm font-base text-black p-3 cursor-pointer hover:bg-[#E9ECF1] hover:text-[#199F48] rounded-lg";

  return (
    <div className="w-[150px] flex flex-col bg-[#F2F4F7] rounded-lg">
      <div className={`${styleBox}`}>My Profile</div>
      {roles === "admin" && <div className={`${styleBox}`}>Admin Panel</div>}
      <div className={`${styleBox}`}>My Orders</div>
      <div
        onClick={!authed ? () => router.push("/Login") : logout}
        className={`${
          !authed ? "text-[#199F48]" : "text-red-500 hover:text-red-500"
        } ${styleBox} `}
      >
        {!authed ? "Log in" : "Log Out"}
      </div>
    </div>
  );
}
