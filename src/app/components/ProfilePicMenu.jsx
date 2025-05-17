import React from "react";
import { useRouter } from "next/navigation";
import { User, LogIn, LogOut, List } from "lucide-react";

export default function ProfilePicMenu({
  fullName,
  email,
  roles,
  authed,
  logout,
}) {
  const router = useRouter();

  const styleBox =
    "flex flex-row text-sm font-medium text-[#535353] p-2 cursor-pointer hover:bg-[#EDEDED] rounded-lg gap-2 m-2";

  return (
    <div className="w-[306px] flex flex-col bg-[#F2F4F7] rounded-lg">
      {authed !== null && (
        <div className="flex h-[74px] items-center gap-2 mx-2">
          <div className="rounded-full w-10 h-10  bg-gray-400 cursor-pointer "></div>
          <div>
            <p className="font-medium text-black">{fullName}</p>
            <p className="font-medium text-[#737373]">{email}</p>
          </div>
        </div>
      )}
      <div
        className={`${
          authed !== null ? "border-y " : "border-b "
        } border-[#E6E6E6]`}
      >
        <div className={`${styleBox}`}>
          <User size={20} />
          <span className=""> Account Setting</span>{" "}
        </div>
        {roles === "admin" && <div className={`${styleBox}`}>Admin Panel</div>}
        <div className={`${styleBox}`}>
          <List size={20} />
          <span> My Orders</span>
        </div>
      </div>
      <div
        onClick={!authed ? () => router.push("/Login") : logout}
        className={` ${styleBox} `}
      >
        {!authed ? (
          <LogIn size={20} stroke="green" />
        ) : (
          <LogOut size={20} stroke="red" />
        )}
        <span className={`${!authed ? "text-[#199F48]" : "text-[#E50000]"}`}>
          {!authed ? "Log in" : "Logout"}
        </span>
      </div>
    </div>
  );
}
