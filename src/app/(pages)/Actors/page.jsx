'use client';

import AddActor from "@/app/components/AddActor"; // Pastikan komponen ini ada
import Navbar from "@/app/components/Navbar";
import Privilage from "@/app/components/Privilage";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const actors = [
    {
        id: 1,
        nama: "Mas Fu’ad Grobogan Jateng",
        email: "fuadtamvan@gmail.com",
        status: "Belum Bayar",
        saldoSukarela: "Rp. 192.700",
        saldoWajib: "Rp. 192.700",
        privilage: "admin",
    },
    {
        id: 2,
        nama: "Mas Fu’ad Grobogan Jateng",
        email: "fuadtamvan@gmail.com",
        status: "Sudah Bayar",
        saldoSukarela: "Rp. 192.700",
        saldoWajib: "Rp. 192.700",
        privilage: "penitip",
    },
    {
        id: 8,
        nama: "Mas Fu’ad Grobogan Jateng",
        email: "fuadtamvan@gmail.com",
        status: "Belum Bayar",
        saldoSukarela: "Rp. 192.700",
        saldoWajib: "Rp. 192.700",
        privilage: "pegawai",
    },
    {
        id: 9,
        nama: "Mas Fu’ad Grobogan Jateng",
        email: "fuadtamvan@gmail.com",
        status: "Belum Bayar",
        saldoSukarela: "Rp. 192.700",
        saldoWajib: "Rp. 192.700",
        privilage: "pegawai",
    },
    {
        id: 10,
        nama: "Mas Fu’ad Grobogan Jateng",
        email: "fuadtamvan@gmail.com",
        status: "Belum Bayar",
        saldoSukarela: "Rp. 192.700",
        saldoWajib: "Rp. 192.700",
        privilage: "pegawai",
    },
];

export default function ActorsPage() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAddActor, setShowAddActor] = useState(false);
    // const [privilageDropdown, setPrivilageDropdown] = useState(false); // Ini sepertinya untuk form AddActor, bisa dipindah ke sana jika hanya digunakan di sana
    // const [selectedPrivilage, setSelectedPrivilage] = useState("Admin"); // Sama seperti di atas
    const dropdownRef = useRef(null);
    // const privilageRef = useRef(null); // Sama seperti di atas

    // --- State dan Handler untuk Navbar ---
    const [keyword, setKeyword] = useState('');
    const [authUser, setAuthUser] = useState(null); // Inisialisasi sesuai kebutuhan

    useEffect(() => {
        // Contoh: Mengisi authUser dengan data dummy atau dari API saat komponen dimuat
        // Sesuaikan ini dengan logika autentikasi dan pengambilan data pengguna Anda
        setAuthUser({
            tipe: "admin",
            fullname: "Nama Admin Contoh",
            email: "admin@example.com",
            saldo: 500000,
            // tambahkan properti lain yang dibutuhkan Navbar
        });
    }, []);

    async function onLogoutHandler() {
        console.log("Logout berhasil");
        setAuthUser(null);
        // Tambahkan logika redirect atau pembersihan state lainnya jika perlu
    }
    // --------------------------------------

    // Close dropdown "Actions" if click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            // Jika privilageRef masih digunakan di halaman ini (misalnya untuk filter), biarkan.
            // Jika hanya untuk form AddActor, logika ini bisa dipindah ke komponen AddActor.
            // if (privilageRef.current && !privilageRef.current.contains(event.target)) {
            //     setPrivilageDropdown(false);
            // }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (showAddActor) {
        return (
            <AddActor
                onClose={() => setShowAddActor(false)}
                // Anda mungkin perlu meneruskan state terkait privilage ke AddActor
                // selectedPrivilage={selectedPrivilage}
                // setSelectedPrivilage={setSelectedPrivilage}
                // privilageDropdown={privilageDropdown}
                // setPrivilageDropdown={setPrivilageDropdown}
                // privilageRef={privilageRef}
            />
        );
    }

    // Tampilan default (table actors)
    return (
        <div className="w-full min-h-screen flex flex-col bg-white">
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
            <div className="flex flex-1"> {/* flex-1 agar mengambil sisa tinggi layar */}
                <SidebarAdmin />
                {/* Main Content */}
                {/* Hilangkan top-[88px], biarkan flexbox menangani posisi relatif terhadap Navbar */}
                {/* Gunakan flex-1 untuk mengambil sisa lebar, overflow-auto untuk scroll jika konten melebihi */}
                <main className="flex-1 p-5 overflow-auto">
                    <div className="w-full"> {/* Tidak perlu h-[840px] atau top-[16px] lagi */}
                        {/* Header Info & Actions Button */}
                        <div className="w-full mb-6 flex justify-between items-end"> {/* Ganti inline-flex dan top/left */}
                            <div className="flex justify-start items-start gap-9">
                                {/* Iuran Wajib */}
                                <div className="inline-flex flex-col justify-start items-start gap-2">
                                    <div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">Iuran Wajib:</div>
                                    <div className="min-w-40 px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-1 outline-[#D0D0D0] inline-flex justify-start items-center gap-2">
                                        <div className="text-stone-500 text-base font-normal font-['Geist'] leading-tight">Rp</div>
                                        <div className="text-neutral-900 text-base font-medium font-['Geist'] leading-normal">172.659.267</div>
                                    </div>
                                </div>
                                {/* Tenggat Bayar */}
                                <div className="inline-flex flex-col justify-start items-start gap-2">
                                    <div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">Tenggat Bayar:</div>
                                    <div className="px-3 py-2 bg-white rounded-lg outline outline-offset-[-1px] outline-1 outline-[#D0D0D0] inline-flex justify-start items-center gap-2">
                                        <div className="size-5 relative">
                                            <Image src="/Calendar.svg" alt="Calendar" width={20} height={20} />
                                        </div>
                                        <div>
                                            <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">Tgl </span>
                                            <span className="text-black text-base font-medium font-['Geist'] leading-normal">27</span>
                                            <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal"> / Bulan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Actions Button */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowDropdown((v) => !v)}
                                    className="px-3 py-2 bg-black rounded-lg outline outline-1 outline-offset-[-1px] flex justify-start items-center gap-1 overflow-hidden"
                                >
                                    <span className="w-6 h-6 flex items-center justify-center">
                                        <Image src="/listrik.svg" alt="Listrik" width={24} height={24} className="w-6 h-6" style={{ filter: "brightness(0) invert(1)" }} priority />
                                    </span>
                                    <div className="px-2 flex justify-center items-center">
                                        <div className="text-white text-base font-medium font-['Geist'] leading-normal">Actions</div>
                                    </div>
                                    <span className="w-6 h-6 flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                </button>
                                {showDropdown && (
                                    <div
                                        className="absolute p-2 right-0 mt-2 bg-white rounded-md shadow-lg inline-flex flex-col justify-start items-start gap-1 z-30" // Menyederhanakan shadow, menghapus 'n'
                                        style={{ minWidth: "180px" }}
                                    >
                                        <div className="w-full px-3 py-2 text-left text-black text-sm font-normal font-['Geist'] leading-tight cursor-pointer hover:bg-gray-100 rounded" onClick={() => { setShowDropdown(false); setShowAddActor(true); }}>
                                            Tambah Aktor
                                        </div>
                                        <div className="w-full px-3 py-2 text-left text-black text-sm font-normal font-['Geist'] leading-tight cursor-pointer hover:bg-gray-100 rounded" onClick={() => setShowDropdown(false)}>
                                            Edit Iuran
                                        </div>
                                        <div className="w-full px-3 py-2 text-left text-black text-sm font-normal font-['Geist'] leading-tight cursor-pointer hover:bg-gray-100 rounded" onClick={() => setShowDropdown(false)}>
                                            Edit Tenggat Bayar
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Table Container */}
                        {/* Hilangkan top-[96px], gunakan margin jika perlu (mb-6 di atas sudah memberi jarak) */}
                        <div className="w-full flex flex-col">
                            {/* Table Header */}
                            <div className="w-full border-b border-[#E5E5E5] flex flex-col justify-start items-start gap-2.5">
                                <div className="self-stretch inline-flex justify-start items-center">
                                    <div className="w-14 h-14 max-w-16 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">ID</div></div>
                                    <div className="flex-1 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Nama anggota</div></div>
                                    <div className="flex-1 h-14 min-w-48 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Email</div></div>
                                    <div className="flex-1 h-14 max-w-32 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Status</div></div>
                                    <div className="flex-1 h-14 max-w-32 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Saldo sukarela</div></div>
                                    <div className="flex-1 h-14 max-w-28 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Saldo wajib</div></div>
                                    <div className="flex-1 h-14 max-w-28 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Privilege</div></div>
                                    <div className="w-24 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Aksi</div></div>
                                </div>
                            </div>
                            {/* Table Rows */}
                            {actors.map((actor) => (
                                <div key={actor.id} className="self-stretch h-16 border-b border-[#E5E5E5] inline-flex justify-start items-center">
                                    <div className="w-14 self-stretch max-w-16 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.id}</div></div>
                                    <div className="flex-1 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.nama}</div></div>
                                    <div className="flex-1 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.email}</div></div>
                                    <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                                        <div className={`text-base font-medium font-['Geist'] leading-normal ${actor.status === "Sudah Bayar" ? "text-black" : "text-red-600"}`}>
                                            {actor.status}
                                        </div>
                                    </div>
                                    <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.saldoSukarela}</div></div>
                                    <div className="flex-1 self-stretch max-w-28 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.saldoWajib}</div></div>
                                    <div className="flex-1 self-stretch max-w-28 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><Privilage value={actor.privilage} /></div>
                                    <div className="w-24 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                        <Image src="/Trash.svg" alt="Hapus" width={20} height={20} className="w-5 h-5 cursor-pointer" />
                                        <Image src="/Pensil.svg" alt="Edit" width={20} height={20} className="w-5 h-5 cursor-pointer" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination */}
                        <div className="w-full mt-6 flex justify-center items-center gap-2"> {/* mt-6 untuk jarak dari tabel */}
                            <div className="flex justify-center items-center gap-2">
                                <button className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition" aria-label="Previous Page">
                                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                                <div className="text-black text-base font-medium font-['Geist'] leading-normal">1</div>
                                <div className="text-gray-500 text-base font-medium font-['Geist'] leading-normal">...</div>
                                <div className="text-gray-500 text-base font-medium font-['Geist'] leading-normal">6</div>
                                <button className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition" aria-label="Next Page">
                                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 4L10 8L6 12" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            {/* Success Notification (jika perlu) */}
        </div>
    );
}