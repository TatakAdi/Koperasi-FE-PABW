"use client";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Bell } from "lucide-react";

export default function Navbar({
  keyword,
  onKeywordCahnge,
  toggleKeywordSearch,
  toggleCheckoutPanel,
  toggleNotificationPanel,
  authUser,
}) {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center w-full  h-[88px] px-6 sticky top-0 z-1 bg-white">
      <div
        className="w-[44px] h-[44px] relative cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          fill
          className="object-contain cursor-pointer"
        />
      </div>
      <SearchBar
        keyword={keyword}
        onKeywordChange={onKeywordCahnge}
        toggleKeywordSearch={toggleKeywordSearch}
      />
      <div className="flex justify-around items-center gap-6 ">
        <div>
          <button
            onClick={() => router.push("/Keranjang")}
            className="cursor-pointer"
          >
            <ShoppingCart size={24} stroke="black" fill="black" />
          </button>
        </div>
        <span className="text-2xl text-[#E0E0E0] ">/</span>
        <div className="flex justify-around items-center gap-4 ">
          <Bell
            size={24}
            stroke="black"
            fill="black"
            className="cursor-pointer"
          />
          <div
            id="profile"
            className="rounded-full w-10 h-10 bg-gray-400 cursor-pointer"
          ></div>
        </div>
        {/* Notification & Profile Picture */}
      </div>
    </div>
  );
}
