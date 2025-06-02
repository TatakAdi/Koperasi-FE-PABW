'use client';

import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { useEffect, useState } from "react";

export default function SellingsPage() {
  const [keyword, setKeyword] = useInput();
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await getUserLogged();
      if (error) {
        console.log("Token Invalid & Data user gagal terambil");
        return;
      }
      setAuthUser(data);
    };
    getUser();
  }, []);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  // Data dummy sesuai jumlah di desain (12 baris)
  const data = [
    {
      nama: "Mas Narji",
      metode: "Diantar",
      lokasi: "Gedung E",
      tanggal: "25/05/2025",
      detail: [
        { barang: "Roti O Lempuyangan", harga: "Rp 30.690", jumlah: 3, total: "Rp.92.070" },
        { barang: "Roti O Lempuyangan", harga: "Rp 30.690", jumlah: 3, total: "Rp.92.070" },
        { barang: "Roti O Lempuyangan", harga: "Rp 30.690", jumlah: 3, total: "Rp.92.070" },
        { barang: "Roti O Lempuyangan", harga: "Rp 30.690", jumlah: 3, total: "Rp.92.070" },
      ],
      totalPembelian: 4,
    },
    {
      nama: "Mas FUad",
      metode: "Diantar",
      lokasi: "-",
      tanggal: "25/05/2025",
      detail: [
        { barang: "Lato-Lato", harga: "Rp 12.000", jumlah: 1, total: "Rp.12.000" },
        { barang: "Lato-Lato", harga: "Rp 12.000", jumlah: 1, total: "Rp.12.000" },
        { barang: "Lato-Lato", harga: "Rp 12.000", jumlah: 1, total: "Rp.12.000" },
        { barang: "Lato-Lato", harga: "Rp 12.000", jumlah: 1, total: "Rp.12.000" },
      ],
      totalPembelian: 4,
    },
    // ...tambahkan data lain sesuai kebutuhan
  ];

  // Duplikasi data agar ada 12 baris
  while (data.length < 12) {
    data.push({ ...data[data.length % 2], nama: data.length % 2 === 0 ? "Mas Narji" : "Mas FUad" });
  }

  const [activeTab, setActiveTab] = useState("Sedang Proses");
  const [selectedRow, setSelectedRow] = useState(null);

  const tabList = [
    { label: "Sedang Proses" },
    { label: "Dikirim" },
    { label: "Selesai" },
  ];

  return (
    <div className="w-full h-[1024px] relative bg-white">
      {/* Navbar */}
      <Navbar
        keyword={keyword}
        onKeywordChange={setKeyword}
        authUser={authUser}
        roles={authUser ? authUser.tipe : null}
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
          {/* Title & Tabs */}
          <div className="w-full flex flex-col gap-6">
            {!selectedRow ? (
              <>
                <div className="flex flex-col gap-2">
                  <div className="text-black text-2xl font-medium font-[Geist]">Manage Sales</div>
                  <div className="text-neutral-500 text-base font-medium font-[Geist]">Lihat riwayat dari barang yang terjual</div>
                </div>
                {/* Tabs */}
                <div className="h-9 inline-flex gap-6">
                  {tabList.map((tab) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.label);
                        setSelectedRow(null);
                      }}
                      className="bg-transparent border-none outline-none px-0"
                    >
                      <div className="flex flex-col items-start">
                        <span
                          className={`text-lg font-medium font-['Geist'] transition-colors ${
                            activeTab === tab.label
                              ? "text-black"
                              : "text-neutral-400"
                          }`}
                        >
                          {tab.label}
                        </span>
                        {activeTab === tab.label && (
                          <div className="w-full h-1 bg-black rounded mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              // Breadcrumb only for detail view
              <div className="flex flex-col gap-2">
                {/* <div className="inline-flex items-center gap-4">
                  <div className="text-SIDE-ICON text-base font-normal font-['Geist'] leading-tight">Manage Sales</div>
                  <div className="size-5 relative overflow-hidden">
                    <div className="w-[5px] h-2.5 left-[7.50px] top-[5px] absolute outline outline-2 outline-offset-[-0.88px] outline-neutral-400" />
                  </div>
                  <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-tight">Sales Details</div>
                </div> */}
              </div>
            )}
          </div>
          {/* Main Table or Detail */}
          {!selectedRow ? (
            <div className="w-full flex flex-col gap-6">
              <div className="w-full flex flex-col">
                {/* Table Header */}
                <div className="pl-4 border-b border-neutral-200 flex flex-col gap-2.5 overflow-hidden">
                  <div className="inline-flex justify-start items-center gap-4 w-full">
                    <div className="flex-1 h-14 border-r border-neutral-200 flex items-center gap-2">
                      <img src="/Person.svg" alt="person" className="size-6" />
                      <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Nama Pembeli</div>
                    </div>
                    <div className="flex-1 h-14 border-r border-neutral-200 flex items-center gap-2">
                      <img src="/Delivery.svg" alt="delivery" className="size-6" />
                      <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Metode Pengiriman</div>
                    </div>
                    <div className="flex-1 h-14 border-r border-neutral-200 flex items-center gap-2">
                      <img src="/Build.svg" alt="build" className="size-6" />
                      <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Lokasi Gedung</div>
                    </div>
                    <div className="flex-1 h-14 border-r border-neutral-200 flex items-center gap-2">
                      <img src="/Uang.svg" alt="uang" className="size-6" />
                      <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Transaction Date</div>
                    </div>
                  </div>
                </div>
                {/* Table Rows */}
                <div className="pl-4 border-b border-neutral-200 flex flex-col overflow-hidden">
                  {data.map((row, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="inline-flex justify-start items-center gap-4 border-b border-neutral-200 w-full hover:bg-gray-100 transition"
                      onClick={() => setSelectedRow(row)}
                    >
                      <div className="flex-1 py-2 border-r border-neutral-200 flex items-center gap-2 text-left">
                        <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{row.nama}</div>
                      </div>
                      <div className="flex-1 py-2 border-r border-neutral-200 flex items-center gap-2 text-left">
                        <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{row.metode}</div>
                      </div>
                      <div className="flex-1 py-2 border-r border-neutral-200 flex items-center gap-2 text-left">
                        <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{row.lokasi}</div>
                      </div>
                      <div className="flex-1 py-2 border-r border-neutral-200 flex items-center gap-2 text-left">
                        <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{row.tanggal}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Pagination */}
              <div className="w-full flex justify-center items-center gap-2">
                <div className="flex justify-center items-center gap-2">
                  <button
                    className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                    aria-label="Previous Page"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">1</div>
                  <div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">...</div>
                  <div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">6</div>
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
          ) : (
            // Detail View sesuai design
            <div className="w-full h-full flex flex-col justify-start items-start gap-6">
              {/* Breadcrumb */}
              <div className="inline-flex items-center gap-2 mt-2">
                <span className="text-neutral-400 text-base font-normal font-['Geist'] leading-tight">Manage Sales</span>
                {/* Arrow icon */}
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M8 6L12 10L8 14" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-tight">Sales Details</span>
              </div>
              {/* Nama dan subjudul */}
              <div>
                <div className="text-black text-2xl font-medium font-['Geist']">{selectedRow.nama}</div>
                <div className="text-neutral-500 text-base font-medium font-['Geist']">Detail pembelian</div>
              </div>
              {/* Table */}
              <div className="w-full flex flex-col justify-start items-start gap-6">
                <div className="w-full border-b border-STROKE1 flex flex-col">
                  {/* Table Header */}
                  <div className="pl-4 border-b border-STROKE1 flex flex-col gap-2.5 overflow-hidden">
                    <div className="inline-flex justify-start items-center gap-4 w-full">
                      <div className="flex-1 h-14 border-r border-STROKE1 flex items-center gap-2">
                        <img src="/Box.svg" alt="box" className="size-6" />
                        <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Nama Barang</div>
                      </div>
                      <div className="flex-1 h-14 border-r border-STROKE1 flex items-center gap-2">
                        <img src="/Tag.svg" alt="tag" className="size-6" />
                        <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Harga</div>
                      </div>
                      <div className="flex-1 h-14 border-r border-STROKE1 flex items-center gap-2">
                        <img src="/Cart2.svg" alt="cart" className="size-6" />
                        <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Jumlah</div>
                      </div>
                      <div className="flex-1 h-14 border-r border-STROKE1 flex items-center gap-2">
                        <img src="/Uang.svg" alt="uang" className="size-6" />
                        <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Total Harga</div>
                      </div>
                    </div>
                  </div>
                  {/* Table Rows */}
                  <div className="pl-4 border-b flex flex-col overflow-hidden">
                    {selectedRow.detail.map((item, idx) => (
                      <div
                        key={idx}
                        className="inline-flex justify-start items-center gap-4 border-b border-STROKE1 w-full"
                      >
                        <div className="flex-1 py-2 border-r border-STROKE1 flex items-center gap-2">
                          <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{item.barang}</div>
                        </div>
                        <div className="flex-1 py-2 border-r border-STROKE1 flex items-center gap-2">
                          <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{item.harga}</div>
                        </div>
                        <div className="flex-1 py-2 border-r border-STROKE1 flex items-center gap-2">
                          <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{item.jumlah}</div>
                        </div>
                        <div className="flex-1 py-2 border-r border-STROKE1 flex items-center gap-2">
                          <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{item.total}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Total Pembelian */}
                  <div className="pl-4 border-b flex flex-col overflow-hidden">
                    <div className="inline-flex justify-start items-center gap-4 border-t border-b border-zinc-500 w-full">
                      <div className="flex-1 py-2 border-r border-zinc-500 flex items-center gap-2">
                        <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">Total Pembelian (Order Qts)</div>
                      </div>
                      <div className="w-64 py-2 border-r border-b border-zinc-500 flex items-center gap-2">
                        <div className="flex-1 text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{selectedRow.totalPembelian}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Pagination */}
                <div className="w-full flex justify-center items-center gap-2">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                      aria-label="Previous Page"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                        <path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">1</div>
                    <div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">...</div>
                    <div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">6</div>
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
                {/* Tombol kembali ke tabel utama */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition font-medium"
                    onClick={() => setSelectedRow(null)}
                  >
                    Kembali ke Daftar Penjualan
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}