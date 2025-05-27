"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import useInput from "@/app/hooks/useInput";
import Navbar from "@/app/components/Navbar";
import SidePanel from "@/app/components/SidePanel";
import CartItem from "@/app/components/keranjang/CartItem";

export default function MyOrders() {
  const [authUser, setAuthUser] = useState(null);
  const [category, setCategory] = useState(null);
  const [status, setStatus] = useState("Belum Dibayar"); // "Belum Dibayar", "Sedang Diproses", "Sedang Dikirim", "Selesai"
  const [minPrice, setMinPrice] = useInput();
  const [maxPrice, setMaxPrice] = useInput();
  const [keyword, setKeyword] = useInput();
  const [sellSort, setSellSort] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Untuk notifikasi barang berhasil ke keranjang atau tidak
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await getUserLogged();

      if (error) {
        console.log("Token Invalid & Data user gagal terambil");
        return;
      }

      console.log("Data pengguna :", data);
      setAuthUser(data);
    };
    getUser();
  }, []);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  const onCategoryChange = (selectedCategory) => {
    if (category === selectedCategory) {
      setCategory(null);
    } else {
      setCategory(selectedCategory);
    }
  };

  return (
    <div className="min-h-screen h-screen w-full font-[family-name:var(--font-geist-sans)]  overflow-y-hidden">
      <Navbar
        keyword={keyword}
        onKeywordCahnge={setKeyword}
        authUser={authUser}
        roles={authUser !== null && authUser.tipe}
        fullName={authUser !== null && authUser.fullname}
        email={authUser !== null && authUser.email}
        saldo={authUser !== null && authUser.saldo}
        logout={onLogoutHandler}
      />
      <main
        className={`flex mx-5 gap-4 ${
          isFocus ? "-z-10" : "z-0"
        } overflow-hidden h-[calc(100vh-88px)]`}
      >
        <SidePanel
          category={category}
          onCategoryChange={onCategoryChange}
          salesSort={sellSort}
          setSalesSort={setSellSort}
          maxPrice={maxPrice}
          minPrice={minPrice}
          onMaxPriceChange={setMaxPrice}
          onMinPriceChange={setMinPrice}
        />
        <div className="flex-grow h-full">
          <div className={`flex w-full text-[#969696] gap-8 cursor-pointer`}>
            <span
              className={`${
                status === "Belum Dibayar" &&
                "text-black underline underline-offset-4"
              } hover:text-black`}
              onClick={() => setStatus("Belum Dibayar")}
            >
              Belum Dibayar
            </span>
            <span
              className={`${
                status === "Sedang Diproses" &&
                "text-black underline underline-offset-4"
              } hover:text-black`}
              onClick={() => setStatus("Sedang Diproses")}
            >
              Sedang Diproses
            </span>
            <span
              className={`${
                status === "Sedang Dikirim" &&
                "text-black underline underline-offset-4"
              } hover:text-black`}
              onClick={() => setStatus("Sedang Dikirim")}
            >
              Sedang Dikirim
            </span>
            <span
              className={`${
                status === "Selesai" &&
                "text-black underline underline-offset-4"
              } hover:text-black`}
              onClick={() => setStatus("Selesai")}
            >
              Selesai
            </span>
          </div>

          {status === "Belum Dibayar" && (
            <>
              <div className="grid grid-cols-4 items-center">
                <div className="text-lg pl-4">Nama Barang</div>
                <div className="text-lg text-left">Harga</div>
                <div className="text-lg text-center">Jumlah</div>
                <div className="text-lg text-center">Aksi</div>
              </div>

              <div className="divide-y"></div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
