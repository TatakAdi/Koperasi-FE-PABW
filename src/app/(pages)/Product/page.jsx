'use client';

import Kategori from "@/app/components/Kategori";
import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { useEffect, useState } from "react";

export default function ProductPage() {
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
    <div className="w-full h-[1024px] relative bg-white overflow-hidden">
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
      <div className="w-full h-full px-5 py-4 mr-[32px] top-[88px] bg-white rounded-xl flex flex-col gap-12 overflow-hidden">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="text-black text-2xl font-medium font-[Geist]">Data Barang</div>
            <div className="text-neutral-500 text-base font-medium font-[Geist]">Lihat rincian dari produk yang tersedia</div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              {/* Table Header */}
              <div className="w-full border-b border-neutral-200 flex flex-col gap-2.5">
                <div className="flex items-center">
                  <div className="w-full h-14 border-r max-w-[10%] border-neutral-200 flex justify-center items-center gap-2">
                    <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Gambar</div>
                  </div>
                  <div className="w-full h-14 border-r border-neutral-200 flex justify-center items-center gap-2">
                    <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Nama Barang</div>
                  </div>
                  <div className="w-full h-14 border-r max-w-[15%] border-neutral-200 flex justify-center items-center gap-2">
                    <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Kategori</div>
                  </div>
                  <div className="w-full h-14 border-r max-w-[10%] border-neutral-200 flex justify-center items-center gap-2">
                    <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Harga</div>
                  </div>
                  <div className="w-full h-14 border-r max-w-[10%] border-neutral-200 flex justify-center items-center gap-2">
                    <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Stok</div>
                  </div>
                  <div className="w-full h-14 border-r max-w-[15%] border-neutral-200 flex justify-center items-center gap-2">
                    <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Penjual</div>
                  </div>
                  <div className="w-full h-14 border-r max-w-[10%] border-neutral-200 flex justify-center items-center gap-2">
                    <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Aksi</div>
                  </div>
                </div>
              </div>
              {/* Table Rows */}
              <div className="w-full flex flex-col">
                {/* Contoh data, silakan ganti dengan data dinamis */}
                {[
                  {
                    gambar: "https://placehold.co/64x64",
                    nama: "Holland Bakery cabang “Grobogan”",
                    kategori: "berat",
                    harga: "Rp. 20.000",
                    stok: 12,
                    penjual: "Mas Fu’ad Grobogan",
                  },
                  {
                    gambar: "https://placehold.co/64x64",
                    nama: "Holland Bakery cabang “Grobogan”",
                    kategori: "minuman",
                    harga: "Rp. 20.000",
                    stok: 12,
                    penjual: "Mas Fu’ad Grobogan",
                  },
                  {
                    gambar: "https://placehold.co/64x64",
                    nama: "Holland Bakery cabang “Grobogan”",
                    kategori: "ringan",
                    harga: "Rp. 20.000",
                    stok: 12,
                    penjual: "Mas Fu’ad Grobogan",
                  },
                  {
                    gambar: "https://placehold.co/64x64",
                    nama: "Holland Bakery cabang “Grobogan”",
                    kategori: "ringan",
                    harga: "Rp. 20.000",
                    stok: 12,
                    penjual: "Mas Fu’ad Grobogan",
                  },
                  {
                    gambar: "https://placehold.co/64x64",
                    nama: "Holland Bakery cabang “Grobogan”",
                    kategori: "ringan",
                    harga: "Rp. 20.000",
                    stok: 12,
                    penjual: "Mas Fu’ad Grobogan",
                  },
                  {
                    gambar: "https://placehold.co/64x64",
                    nama: "Holland Bakery cabang “Grobogan”",
                    kategori: "ringan",
                    harga: "Rp. 20.000",
                    stok: 12,
                    penjual: "Mas Fu’ad Grobogan",
                  },
                  {
                    gambar: "https://placehold.co/64x64",
                    nama: "Holland Bakery cabang “Grobogan”",
                    kategori: "ringan",
                    harga: "Rp. 20.000",
                    stok: 12,
                    penjual: "Mas Fu’ad Grobogan",
                  },
                  {
                    gambar: "https://placehold.co/64x64",
                    nama: "Holland Bakery cabang “Grobogan”",
                    kategori: "ringan",
                    harga: "Rp. 20.000",
                    stok: 12,
                    penjual: "Mas Fu’ad Grobogan",
                  },
                  {
                    gambar: "https://placehold.co/64x64",
                    nama: "Holland Bakery cabang “Grobogan”",
                    kategori: "ringan",
                    harga: "Rp. 20.000",
                    stok: 12,
                    penjual: "Mas Fu’ad Grobogan",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border-b border-neutral-200 flex items-center">
                    <div className="w-full self-stretch max-w-[10%] p-2 border-r border-neutral-200 flex justify-center items-center">
                      <img className="size-16 rounded-lg" src={item.gambar} alt={item.nama} />
                    </div>
                    <div className="w-full self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                      <div className="flex-1 text-black text-base font-medium font-[Geist] leading-normal">{item.nama}</div>
                    </div>
                    <div className="w-full max-w-[15%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                      <Kategori value={item.kategori} />
                    </div>
                    <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                      <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.harga}</div>
                    </div>
                    <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                      <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.stok}</div>
                    </div>
                    <div className="w-full max-w-[15%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                      <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.penjual}</div>
                    </div>
                    <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                      <div className="flex gap-4">
                        {/* Icon Trash (kiri) */}
                        <button className="size-6 flex items-center justify-center" aria-label="Delete">
                          <img src="/trash.svg" alt="Delete" className="size-5" />
                        </button>
                        {/* Icon Edit (kanan) */}
                        <button className="size-6 flex items-center justify-center" aria-label="Edit">
                          <img src="/pensil.svg" alt="Edit" className="size-5" />
                        </button>
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
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="text-17-SOFT-BLACK text-base font-medium font-[Geist] leading-normal">1</div>
                  <div className="text-SIDEBAR-MODULE text-base font-medium font-[Geist] leading-normal">...</div>
                  <div className="text-SIDEBAR-MODULE text-base font-medium font-[Geist] leading-normal">6</div>
                  {/* Right Arrow */}
                  <button
                    className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                    aria-label="Next Page"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path d="M6 4L10 8L6 12" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Success Notification */}
      {/* <div className="h-12 p-4 left-[527px] top-[1058px]  bg-fill-success rounded-xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02)] shadow-[0px_8px_16px_-0.5px_rgba(0,0,0,0.02)] shadow-[0px_0px_0px_1px_rgba(41,122,58,0.32)] shadow-[0px_12px_24px_-1.5px_rgba(0,0,0,0.04)] shadow-[0px_16px_32px_-3px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] flex items-center gap-12 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="size-6 relative overflow-hidden">
            <div className="size-5 left-[2px] top-[1.99px]  outline-2 outline-offset-[-1px] outline-foreground-success" />
          </div>
          <div className="text-foreground-success text-base font-medium font-['Inter'] leading-normal">Barang berhasil ditambahkan ke keranjang</div>
        </div>
      </div> */}
      </div>
    </div>
  );
}