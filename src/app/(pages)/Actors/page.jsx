'use client';

import { useState, useRef, useEffect } from "react";
import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import Privilage from "@/app/components/Privilage";
import Image from "next/image";

const actors = [
	{
		id: 1,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Belum Bayar",
		statusClass: "text-DESCTRC-2-FG",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "admin",
	},
	{
		id: 2,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Sudah Bayar",
		statusClass: "text-17-SOFT-BLACK",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "penitip",
	},
	{
		id: 3,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Sudah Bayar",
		statusClass: "text-17-SOFT-BLACK",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "anggota",
	},
	{
		id: 4,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Belum Bayar",
		statusClass: "text-DESCTRC-2-FG",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "pegawai",
	},
	{
		id: 5,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Belum Bayar",
		statusClass: "text-DESCTRC-2-FG",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "admin",
	},
	{
		id: 6,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Sudah Bayar",
		statusClass: "text-17-SOFT-BLACK",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "penitip",
	},
	{
		id: 7,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Sudah Bayar",
		statusClass: "text-17-SOFT-BLACK",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "anggota",
	},
	{
		id: 8,
		nama: "Mas Fu’ad Grobogan Jateng",
		email: "fuadtamvan@gmail.com",
		status: "Belum Bayar",
		statusClass: "text-DESCTRC-2-FG",
		saldoSukarela: "Rp. 192.700",
		saldoWajib: "Rp. 192.700",
		privilage: "pegawai",
	},
];

export default function ActorsPage() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAddActor, setShowAddActor] = useState(false);
    const [privilageDropdown, setPrivilageDropdown] = useState(false);
    const [selectedPrivilage, setSelectedPrivilage] = useState("Admin");
    const dropdownRef = useRef(null);
    const privilageRef = useRef(null);

    // Close dropdown if click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (privilageRef.current && !privilageRef.current.contains(event.target)) {
                setPrivilageDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Jika showAddActor true, tampilkan form Add Actor sesuai desain
    if (showAddActor) {
        return (
            <div className="w-full h-[1024px] relative bg-white overflow-hidden">
                {/* Sidebar */}
                <div className="w-72 min-h-[936px] px-3 pt-3 pb-4 left-[20px] top-[88px] absolute bg-gray-100 rounded-xl flex flex-col gap-2.5 overflow-hidden z-10">
                    <SidebarAdmin />
                </div>
                {/* Navbar */}
                <div className="w-full h-20 left-0 top-0 absolute bg-white border-b overflow-hidden z-20">
                    <Navbar />
                </div>
                {/* Main Content */}
                <div className="w-[1124px] h-[936px] px-5 py-4 left-[316px] top-[81px] absolute bg-white rounded-xl flex flex-col justify-start items-start gap-6 overflow-hidden z-0">
                    <div className="self-stretch inline-flex justify-start items-center gap-4">
                        <div className="flex justify-center items-center gap-4">
                            <div className="text-SIDE-ICON text-base font-normal font-['Geist'] leading-tight">Actors</div>
                            {/* Arrow right icon */}
                            <span className="w-5 h-5 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 5L12 10L7 15" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-tight">Add Actors</div>
                        </div>
                    </div>
                    <div className="self-stretch min-w-[1084px] inline-flex justify-between items-end">
                        <div className="inline-flex flex-col justify-start items-start gap-2">
                            <div className="text-black text-2xl font-medium font-['Geist']">Add Actors</div>
                            <div className="text-neutral-500 text-base font-medium font-['Geist']">Tambah aktor baru ke list</div>
                        </div>
                        <button
                            className="px-4 py-2 bg-black rounded-lg outline outline-1 outline-offset-[-1px] flex justify-center items-center gap-1 overflow-hidden"
                            onClick={() => setShowAddActor(false)}
                        >
                            <div className="px-2 flex justify-center items-center">
                                <div className="text-white text-base font-medium font-['Geist'] leading-normal">Submit</div>
                            </div>
                        </button>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-6">
                        <div className="inline-flex justify-start items-start gap-6">
                            <div className="w-96 max-w-96 inline-flex flex-col justify-start items-start gap-2">
                                <div className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">Nama</div>
                                <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl inline-flex justify-start items-center overflow-hidden">
                                    <input
                                        type="text"
                                        placeholder="Masukkan nama"
                                        className="bg-gray-100 outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist']"
                                    />
                                </div>
                            </div>
                            <div className="w-96 max-w-96 inline-flex flex-col justify-start items-start gap-2">
                                <div className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">Email</div>
                                <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl inline-flex justify-start items-center overflow-hidden">
                                    <input
                                        type="email"
                                        placeholder="Masukkan email"
                                        className="bg-gray-100 outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist']"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full max-w-[864px] inline-flex justify-start items-start gap-6">
                            <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                                <div className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">Privilege</div>
                                <div className="relative self-stretch">
                                    <button
                                        type="button"
                                        className="w-full h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex justify-between items-center"
                                        onClick={() => setPrivilageDropdown((v) => !v)}
                                    >
                                        <span className="text-neutral-900 text-base font-medium font-['Geist']">{selectedPrivilage}</span>
                                        <svg width="20" height="20" fill="none">
                                            <path d="M7 8L10 11L13 8" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    {privilageDropdown && (
                                        <div
                                            ref={privilageRef}
                                            className="font-['Inter'] absolute left-0 right-0 mt-2 z-20 self-stretch bg-white rounded-md shadow-[-8px_0px_24px_16px_rgba(0,0,0,0.04)] shadow-[0px_8px_16px_-0.5px_rgba(0,0,0,0.02)] shadow-[0px_0px_0px_1px_rgba(224,224,224,1.00)] shadow-[0px_12px_24px_-1.5px_rgba(0,0,0,0.04)] shadow-[0px_16px_32px_-3px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start"
                                        >
                                            {["Admin", "Pegawai", "Anggota", "Penitip"].map((item, idx) => (
                                                <div
                                                    key={item}
                                                    className={
                                                        "self-stretch h-12 pl-4 pr-3 py-3 " +
                                                        (item === "Admin"
                                                            ? "bg-white rounded-md"
                                                            : item === "Penitip"
                                                            ? "bg-white rounded-md"
                                                            : "bg-white") +
                                                        " flex justify-start items-start cursor-pointer transition " +
                                                        (selectedPrivilage === item
                                                            ? "ring-2 ring-primary-500"
                                                            : "") +
                                                        " hover:bg-[#F1F5F9]"
                                                    }
                                                    style={{
                                                        fontFamily: "Inter",
                                                        fontWeight: 400,
                                                        fontSize: "16px",
                                                        lineHeight: "normal",
                                                        outline: "none", // memastikan tidak ada outline hitam
                                                        boxShadow: "none", // memastikan tidak ada shadow hitam
                                                        border: "none", // memastikan tidak ada border hitam
                                                    }}
                                                    onClick={() => {
                                                        setSelectedPrivilage(item);
                                                        setPrivilageDropdown(false);
                                                    }}
                                                >
                                                    <div className="justify-start text-black text-base font-normal font-['Inter'] leading-normal">
                                                        {item}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Success Notification */}
                <div className="h-12 p-4 left-[527px] top-[1058px] absolute bg-fill-success rounded-xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02)] shadow-[0px_8px_16px_-0.5px_rgba(0,0,0,0.02)] shadow-[0px_0px_0px_1px_rgba(41,122,58,0.32)] shadow-[0px_12px_24px_-1.5px_rgba(0,0,0,0.04)] shadow-[0px_16px_32px_-3px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] flex items-center gap-12 overflow-hidden z-50">
                    <div className="flex items-center gap-3">
                        <div className="size-6 relative overflow-hidden">
                            <div className="size-5 left-[2px] top-[1.99px] absolute outline outline-2 outline-offset-[-1px] outline-foreground-success" />
                        </div>
                        <div className="text-foreground-success text-base font-medium font-['Inter'] leading-normal">
                            Barang berhasil ditambahkan ke keranjang
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Tampilan default (table actors)
    return (
        <div className="w-full h-[1024px] relative bg-white overflow-hidden">
            {/* Navbar */}
            <div className="w-full h-20 left-0 top-0 absolute bg-white border-b overflow-hidden z-10">
                <Navbar />
            </div>
            {/* Sidebar */}
            <div className="w-72 min-h-[936px] px-3 pt-3 pb-4 left-[20px] top-[88px] absolute bg-gray-100 rounded-xl flex flex-col gap-2.5 overflow-hidden z-10">
                <SidebarAdmin />
            </div>
            {/* Main Content */}
            <div className="w-[1124px] h-[936px] left-[316px] top-[88px] absolute bg-white rounded-xl overflow-hidden">
                <div className="w-[1072px] h-[840px] left-[20px] top-[16px] absolute">
                    {/* Header Info */}
                    <div className="w-[1072px] h-16 left-0 top-0 absolute inline-flex justify-between items-end">
                        <div className="flex justify-start items-start gap-9">
                            <div className="inline-flex flex-col justify-start items-start gap-2">
                                <div className="inline-flex justify-center items-center gap-2.5">
                                    <div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">
                                        Iuran Wajib:
                                    </div>
                                </div>
                                <div className="min-w-40 px-3 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stroke-4 inline-flex justify-start items-center gap-2">
                                    <div className="inline-flex flex-col justify-center items-center gap-2.5">
                                        <div className="self-stretch text-foreground-9 text-base font-normal font-['Geist'] leading-tight">
                                            Rp
                                        </div>
                                    </div>
                                    <div className="flex justify-start items-center gap-2">
                                        <div className="flex justify-center items-center">
                                            <div className="text-neutral-900 text-base font-medium font-['Geist'] leading-normal">
                                                172.659.267
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="min-w-40 inline-flex flex-col justify-start items-start gap-2">
                                <div className="inline-flex justify-center items-center gap-2.5">
                                    <div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">
                                        Tenggat Bayar:
                                    </div>
                                </div>
                                <div className="px-3 py-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-stroke-4 inline-flex justify-start items-center gap-2">
                                    <div className="size-5 relative overflow-hidden">
                                        <div className="w-0 h-[3.33px] left-[6.67px] top-[1.67px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-400" />
                                        <div className="w-0 h-[3.33px] left-[13.33px] top-[1.67px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-400" />
                                        <div className="size-3.5 left-[2.50px] top-[3.33px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-400" />
                                        <div className="w-3.5 h-0 left-[2.50px] top-[8.33px] absolute outline outline-2 outline-offset-[-1px] outline-neutral-400" />
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <div className="justify-start">
                                            <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
                                                Tgl{" "}
                                            </span>
                                            <span className="text-black text-base font-medium font-['Geist'] leading-normal">
                                                27
                                            </span>
                                            <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
                                                {" "}/ Bulan
                                            </span>
                                        </div>
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
                                    <Image
                                        src="/listrik.svg"
                                        alt="Listrik"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6"
                                        style={{ filter: "brightness(0) invert(1)" }}
                                        priority
                                    />
                                </span>
                                <div className="px-2 flex justify-center items-center">
                                    <div className="text-white text-base font-medium font-['Geist'] leading-normal">
                                        Actions
                                    </div>
                                </div>
                                <span className="w-6 h-6 flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9L12 15L18 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </button>
                            {showDropdown && (
                                <div
                                    className="p-2 absolute right-0 mt-2 bg-white rounded-md shadow-[-8px_0px_24px_16px_rgba(0,0,0,0.04)] shadow-[0px_8px_16px_-0.5px_rgba(0,0,0,0.02)] shadow-[0px_0px_0px_1px_rgba(224,224,224,1.00)] shadow-[0px_12px_24px_-1.5px_rgba(0,0,0,0.04)] shadow-[0px_16px_32px_-3px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-3 overflow-hidden z-30"
                                    style={{ minWidth: "180px" }}
                                >
                                    <div
                                        className="w-44 px-2 py-1.5 bg-white inline-flex justify-start items-center gap-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            setShowDropdown(false);
                                            setShowAddActor(true);
                                        }}
                                    >
                                        <div className="flex-1 justify-start text-black text-sm font-normal font-['Geist'] leading-tight">
                                            Tambah Aktor
                                        </div>
                                    </div>
                                    <div
                                        className="w-44 px-2 py-1.5 bg-white inline-flex justify-start items-center gap-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <div className="flex-1 justify-start text-black text-sm font-normal font-['Geist'] leading-tight">
                                            Edit Iuran
                                        </div>
                                    </div>
                                    <div
                                        className="w-44 px-2 py-1.5 bg-white inline-flex justify-start items-center gap-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <div className="flex-1 justify-start text-black text-sm font-normal font-['Geist'] leading-tight">
                                            Edit Tenggat Bayar
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Table */}
                    <div className="w-[1072px] left-0 top-[96px] absolute flex flex-col justify-start items-start">
                        <div className="w-full max-w-[1084px] border-b border-[#E5E5E5] flex flex-col justify-start items-start gap-2.5 overflow-hidden">
                            <div className="self-stretch inline-flex justify-start items-center">
                                <div className="size-14 max-w-16 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="justify-start text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Id</div>
                                </div>
                                <div className="flex-1 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="justify-start text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Nama anggota</div>
                                </div>
                                <div className="flex-1 h-14 max-w-52 min-w-48 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="justify-start text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Email</div>
                                </div>
                                <div className="w-28 h-14 max-w-28 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="justify-start text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Status</div>
                                </div>
                                <div className="flex-1 h-14 max-w-32 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="justify-start text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Saldo sukarela</div>
                                </div>
                                <div className="flex-1 h-14 max-w-28 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="justify-start text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Saldo wajib</div>
                                </div>
                                <div className="flex-1 h-14 max-w-28 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="justify-start text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Privilege</div>
                                </div>
                                <div className="w-24 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="justify-start text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Aksi</div>
                                </div>
                            </div>
                        </div>
                        {/* Table Rows */}
                        {actors.map((actor) => (
                            <div
                                key={actor.id}
                                className="self-stretch h-16 border-b border-[#E5E5E5] inline-flex justify-start items-center"
                            >
                                <div className="w-14 self-stretch max-w-16 p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">
                                        {actor.id}
                                    </div>
                                </div>
                                <div className="flex-1 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="flex-1 text-black text-base font-medium font-['Geist'] leading-normal">
                                        {actor.nama}
                                    </div>
                                </div>
                                <div className="w-52 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="flex-1 text-black text-base font-medium font-['Geist'] leading-normal">
                                        {actor.email}
                                    </div>
                                </div>
                                <div className="flex-1 self-stretch max-w-28 p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="w-24 h-6 relative">
                                        <div
                                            className={`w-24 left-0 top-0 absolute text-center text-base font-medium font-['Geist'] leading-normal ${
                                                actor.status === "Sudah Bayar"
                                                    ? "text-black"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {actor.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">
                                        {actor.saldoSukarela}
                                    </div>
                                </div>
                                <div className="flex-1 self-stretch max-w-28 p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">
                                        {actor.saldoWajib}
                                    </div>
                                </div>
                                <div className="flex-1 self-stretch max-w-28 p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <Privilage value={actor.privilage} />
                                </div>
                                <div className="w-24 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                    <div className="flex justify-center items-center gap-4">
                                        <Image
                                            src="/Trash.svg"
                                            alt="Hapus"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                        <Image
                                            src="/Pensil.svg"
                                            alt="Edit"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Pagination */}
                    <div className="w-[1072px] h-6 left-0 top-[816px] absolute flex justify-center items-center gap-2">
                        <div className="flex justify-center items-center gap-2">
                            {/* Left Arrow */}
                            <button
                                className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                                aria-label="Previous Page"
                            >
                                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                    <path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-normal">
                                1
                            </div>
                            <div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
                                ...
                            </div>
                            <div className="text-SIDEBAR-MODULE text-base font-medium font-['Geist'] leading-normal">
                                6
                            </div>
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
            {/* Success Notification */}
            <div className="h-12 p-4 left-[527px] top-[1058px] absolute bg-fill-success rounded-xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02)] shadow-[0px_8px_16px_-0.5px_rgba(0,0,0,0.02)] shadow-[0px_0px_0px_1px_rgba(41,122,58,0.32)] shadow-[0px_12px_24px_-1.5px_rgba(0,0,0,0.04)] shadow-[0px_16px_32px_-3px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] flex items-center gap-12 overflow-hidden">
                <div className="flex items-center gap-3">
                    <div className="size-6 relative overflow-hidden">
                        <div className="size-5 left-[2px] top-[1.99px] absolute outline outline-2 outline-offset-[-1px] outline-foreground-success" />
                    </div>
                    <div className="text-foreground-success text-base font-medium font-['Inter'] leading-normal">
                        Barang berhasil ditambahkan ke keranjang
                    </div>
                </div>
            </div>
        </div>
    );
}