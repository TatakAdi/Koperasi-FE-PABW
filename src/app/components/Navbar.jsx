"use client";
import { Bell, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ProfilePicMenu from "./ProfilePicMenu";
import SearchBar from "./SearchBar";

export default function Navbar({
  keyword,
  onKeywordChange,
  toggleKeywordSearch,
  toggleNotificationPanel,
  fullName,
  email,
  authUser,
  roles,
  logout,
  saldo,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="flex justify-between items-center w-full h-[88px] px-6 sticky top-0 z-1 bg-white">
      <div
        className="w-[44px] h-[44px] relative cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src="/ITKLogo2.svg"
          alt="Logo"
          fill
          className="object-contain cursor-pointer"
        />
      </div>
      <SearchBar
        keyword={keyword}
        onKeywordChange={onKeywordChange}
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
          <div className="relative">
            <div
              id="profile-ring"
              onClick={toggleMenu}
              className="flex justify-center items-center rounded-full hover:bg-[#199F48] cursor-pointer bg-inherit w-12 h-12"
            >
              <div
                id="profile"
                className="rounded-full w-10 h-10  bg-gray-400 cursor-pointer z-1"
              ></div>
            </div>
            {/* Toggle Profile Menu */}
            {isMenuOpen && (
              <div className="absolute top-14 right-0 z-50">
                <ProfilePicMenu
                  fullName={fullName}
                  email={email}
                  authed={authUser}
                  roles={roles}
                  saldo={saldo}
                  logout={logout}
                />
              </div>
            )}
          </div>
        </div>
        {/* Notification & Profile Picture */}
      </div>
    </div>
  );
}
