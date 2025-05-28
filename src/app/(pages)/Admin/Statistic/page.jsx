"use client";

import Navbar from "app/components/Navbar";
import Riwayat from "app/components/Riwayat";
import SidebarAdmin from "app/components/SidebarAdmin";
import useInput from "app/hooks/useInput";
import { getUserLogged } from "app/lib/api/login";
import { logout } from "app/lib/api/logout";
import { useEffect, useState } from "react";

export default function StatAdminPage() {
  const [keyword, setKeyword] = useInput();
  const [authUser, setAuthUser] = useState(null);

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
  return (
    <div className="w-full h-[1024px] relative bg-white">
      {/* Navbar */}
      <Navbar
        keyword={keyword}
        onKeywordChange={setKeyword} // Perbaiki typo dari onKeywordCahnge
        authUser={authUser}
        roles={authUser ? authUser.tipe : null} // Akses properti dengan aman
        fullName={authUser ? authUser.fullname : null}
        email={authUser ? authUser.email : null}
        saldo={authUser ? authUser.saldo : null}
        logout={onLogoutHandler}
      />
      <div className="w-full h-full flex flex-row">
        {/* Sidebar */}
        <SidebarAdmin />
        {/* Main Content */}
        <div className="w-full h-full px-5 py-4 mr-[32px] top-[88px] bg-white rounded-xl flex flex-col gap-12">
          {/* Profit Details */}
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-black text-2xl font-medium font-[Geist]">
                Profit Details
              </div>
              <div className="text-neutral-500 text-base font-medium font-[Geist]">
                Lihat riwayat dari pendapatan
              </div>
            </div>
            <div className="w-full flex flex-row gap-4">
              <Riwayat />
            </div>
          </div>
          {/* Products Sold */}
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-black text-2xl font-medium font-[Geist]">
                Products Sold
              </div>
              <div className="text-neutral-500 text-base font-medium font-[Geist]">
                Lihat riwayat dari barang yang terjual
              </div>
            </div>
            <div className="w-full flex flex-col gap-6 ">
              <div className="w-full flex flex-col">
                {/* Table Header */}
                <div className="w-full border-b border-neutral-200 flex flex-col gap-2.5 overflow-hidden mx-auto">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-14 border-r border-neutral-200 flex items-center gap-2">
                      <img src="/Box.svg" alt="box" className="size-6" />
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">
                        Nama Barang
                      </div>
                    </div>
                    <div className="flex-1 h-14 border-r border-neutral-200 flex items-center gap-2">
                      <img src="/Cart2.svg" alt="cart2" className="size-6" />
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">
                        Jumlah Terjual
                      </div>
                    </div>
                    <div className="flex-1 h-14 flex items-center gap-2">
                      <img src="/Tag.svg" alt="tag" className="size-6" />
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">
                        Total Harga
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table Rows */}
                <div className="w-full flex flex-col overflow-hidden mx-auto">
                  {[
                    {
                      name: "Roti O Lempuyangan",
                      sold: 12,
                      price: "Rp. 16.000.000",
                    },
                    {
                      name: "Lato-Lato asli “Mojokerto”",
                      sold: 1,
                      price: "Rp. 12.000.000",
                    },
                    {
                      name: "Buah Khuldi asli “Samarinda”",
                      sold: 7,
                      price: "Rp. 178.194.500",
                    },
                    {
                      name: "Holland Bakery cabang “Grobogan”",
                      sold: 7,
                      price: "Rp. 178.194.500",
                    },
                    {
                      name: "Tanah Longsor “Himalaya”",
                      sold: 7,
                      price: "Rp. 178.194.500",
                    },
                    {
                      name: "Badai Topan selat “Karimata”",
                      sold: 7,
                      price: "Rp. 178.194.500",
                    },
                    {
                      name: "Rambutan khas “Ponorogo”",
                      sold: 7,
                      price: "Rp. 178.194.500",
                    },
                    {
                      name: "Lato-Lato asli “Mojokerto”",
                      sold: 1,
                      price: "Rp. 12.000.000",
                    },
                    {
                      name: "Buah Khuldi asli “Samarinda”",
                      sold: 7,
                      price: "Rp. 178.194.500",
                    },
                    {
                      name: "Roti O Lempuyangan",
                      sold: 12,
                      price: "Rp. 16.000.000",
                    },
                  ].map((item, idx, arr) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 border-b ${
                        idx === arr.length - 1 ? "" : "border-neutral-200"
                      } last:border-b-0`}
                    >
                      <div className="flex-1 py-2 h-14 border-r border-neutral-200 flex items-center gap-2">
                        <div className="text-black text-base font-medium font-[Geist] leading-normal">
                          {item.name}
                        </div>
                      </div>
                      <div className="flex-1 py-2 h-14 border-r border-neutral-200 flex items-center gap-2">
                        <div className="text-black text-base font-medium font-[Geist] leading-normal">
                          {item.sold}
                        </div>
                      </div>
                      <div className="flex-1 py-2 h-14 flex items-center gap-2">
                        <div className="text-black text-base font-medium font-[Geist] leading-normal">
                          {item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination */}
                <div className="w-[1040px] flex justify-center items-center gap-2 mt-4 mx-auto">
                  <div className="flex items-center gap-2">
                    {/* Left Arrow */}
                    <button
                      className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                      aria-label="Previous Page"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M10 12L6 8L10 4"
                          stroke="#888"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div className="text-17-SOFT-BLACK text-base font-medium font-[Geist] leading-normal">
                      1
                    </div>
                    <div className="text-SIDEBAR-MODULE text-base font-medium font-[Geist] leading-normal">
                      ...
                    </div>
                    <div className="text-SIDEBAR-MODULE text-base font-medium font-[Geist] leading-normal">
                      6
                    </div>
                    {/* Right Arrow */}
                    <button
                      className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                      aria-label="Next Page"
                    >
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M6 4L10 8L6 12"
                          stroke="#888"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Success Notification */}
          {/* <div className="h-12 p-4 left-[527px] top-[1058px]  bg-fill-success rounded-xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02)] shadow-[0px_8px_16px_-0.5px_rgba(0,0,0,0.02)] shadow-[0px_0px_0px_1px_rgba(41,122,58,0.32)] shadow-[0px_12px_24px_-1.5px_rgba(0,0,0,0.04)] shadow-[0px_16px_32px_-3px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] flex items-center gap-12 overflow-hidden">
            <div className="flex items-center gap-3">
              <img src="/Statistic.svg" alt="success" className="size-6" />
              <div className="text-foreground-success text-base font-medium font-['Inter'] leading-normal">Barang berhasil ditambahkan ke keranjang</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
