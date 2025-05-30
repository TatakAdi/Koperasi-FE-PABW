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
    { nama: "Mas Narji", metode: "Diantar", lokasi: "Gedung E", tanggal: "25/05/2025" },
    { nama: "Mas FUad", metode: "Diantar", lokasi: "-", tanggal: "25/05/2025" },
    { nama: "Mas Narji", metode: "Diantar", lokasi: "Gedung E", tanggal: "25/05/2025" },
    { nama: "Mas FUad", metode: "Diantar", lokasi: "-", tanggal: "25/05/2025" },
    { nama: "Mas Narji", metode: "Diantar", lokasi: "Gedung E", tanggal: "25/05/2025" },
    { nama: "Mas FUad", metode: "Diantar", lokasi: "-", tanggal: "25/05/2025" },
    { nama: "Mas Narji", metode: "Diantar", lokasi: "Gedung E", tanggal: "25/05/2025" },
    { nama: "Mas FUad", metode: "Diantar", lokasi: "-", tanggal: "25/05/2025" },
    { nama: "Mas Narji", metode: "Diantar", lokasi: "Gedung E", tanggal: "25/05/2025" },
    { nama: "Mas FUad", metode: "Diantar", lokasi: "-", tanggal: "25/05/2025" },
    { nama: "Mas Narji", metode: "Diantar", lokasi: "Gedung E", tanggal: "25/05/2025" },
    { nama: "Mas FUad", metode: "Diantar", lokasi: "-", tanggal: "25/05/2025" },
  ];

  const [activeTab, setActiveTab] = useState("Sedang Proses");

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
            <div className="flex flex-col gap-2">
              <div className="text-black text-2xl font-medium font-[Geist]">Manage Sales</div>
              <div className="text-neutral-500 text-base font-medium font-[Geist]">Lihat riwayat dari barang yang terjual</div>
            </div>
            {/* Tabs */}
            <div className="h-9 inline-flex gap-6">
              {["Sedang Proses", "Dikirim", "Selesai"].map((tab) => (
                <div
                  key={tab}
                  className={`py-1 min-h-9 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden cursor-pointer`}
                  onClick={() => setActiveTab(tab)}
                >
                  <div className="flex flex-col justify-end items-start gap-1">
                    <div
                      className={`text-lg font-medium font-['Geist'] ${
                        activeTab === tab
                          ? "text-PRIMARY-1"
                          : "text-foreground-8"
                      }`}
                    >
                      {tab}
                    </div>
                    {activeTab === tab && (
                      <div className="h-px p-2.5 bg-PRIMARY-1 w-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Table */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col">
              {/* Table Header */}
              <div className="pl-4 border-b border-STROKE1 flex flex-col gap-2.5 overflow-hidden">
                <div className="inline-flex justify-start items-center gap-4 w-full">
                  <div className="flex-1 h-14 border-r border-STROKE1 flex items-center gap-2">
                    <div className="size-6 relative overflow-hidden" />
                    <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Nama Pembeli</div>
                  </div>
                  <div className="flex-1 h-14 border-r border-STROKE1 flex items-center gap-2">
                    <div className="size-6 relative overflow-hidden" />
                    <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Metode Pengiriman</div>
                  </div>
                  <div className="flex-1 h-14 border-r border-STROKE1 flex items-center gap-2">
                    <div className="size-6 relative overflow-hidden" />
                    <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Lokasi Gedung</div>
                  </div>
                  <div className="flex-1 h-14 border-r border-neutral-200 flex items-center gap-2">
                    <div className="size-6 relative overflow-hidden" />
                    <div className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Transaction Date</div>
                  </div>
                </div>
              </div>
              {/* Table Rows */}
              <div className="pl-4 border-b border-STROKE1 flex flex-col overflow-hidden">
                {data.map((row, idx) => (
                  <div
                    key={idx}
                    className="inline-flex justify-start items-center gap-4 border-b border-STROKE1 w-full"
                  >
                    <div className="flex-1 py-2 border-r border-STROKE1 flex items-center gap-2">
                      <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{row.nama}</div>
                    </div>
                    <div className="flex-1 py-2 border-r border-STROKE1 flex items-center gap-2">
                      <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{row.metode}</div>
                    </div>
                    <div className="flex-1 py-2 border-r border-STROKE1 flex items-center gap-2">
                      <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{row.lokasi}</div>
                    </div>
                    <div className="flex-1 py-2 border-r border-STROKE1 flex items-center gap-2">
                      <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">{row.tanggal}</div>
                    </div>
                  </div>
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
        </div>
      </div>
    </div>
  );
}