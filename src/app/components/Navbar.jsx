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
    <div className="flex justify-between items-center w-full bg-amber-700 h-[88px] px-6">
      <div className="w-[44px] h-[44px] relative">
        <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
      </div>
      <SearchBar
        keyword={keyword}
        onKeywordChange={onKeywordCahnge}
        toggleKeywordSearch={toggleKeywordSearch}
      />
      <div className="flex justify-around items-center">
        <div>
          <button onClick={() => router.push("/checkout")}>
            <ShoppingCart />
          </button>
        </div>
        <p>/</p>
        <div>
          <Bell />
        </div>{" "}
        {/* Notification & Profile Picture */}
      </div>
    </div>
  );
}
