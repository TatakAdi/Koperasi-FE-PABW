'use client';

import Navbar from "@/app/components/Navbar"; // Asumsi Navbar dibutuhkan di halaman ini juga
import SidebarAdmin from "@/app/components/SidebarAdmin"; // Asumsi Sidebar dibutuhkan
import { useEffect, useRef, useState } from 'react';

// Komponen AddActor
export default function AddActor({ onClose }) {
    // State untuk input form
    const [actorName, setActorName] = useState('');
    const [actorEmail, setActorEmail] = useState('');

    // State untuk dropdown privilege
    const [privilageDropdownOpen, setPrivilageDropdownOpen] = useState(false);
    const [selectedPrivilage, setSelectedPrivilage] = useState("Admin"); // Default privilege
    const privilageRef = useRef(null);

    // --- State dan Handler untuk Navbar (Placeholder) ---
    // Jika Navbar di halaman AddActor ini memerlukan data keyword dan authUser sendiri,
    // Anda perlu mengelolanya di sini atau meneruskannya dari komponen yang lebih tinggi.
    // Untuk contoh ini, kita buat placeholder sederhana.
    const [keyword, setKeyword] = useState('');
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        // Placeholder untuk authUser, idealnya ini datang dari context atau prop
        setAuthUser({
            tipe: "admin",
            fullname: "Admin Form",
            email: "adminform@example.com",
            saldo: 0,
        });
    }, []);

    const handleLogout = () => {
        console.log("Logout dari AddActor");
        setAuthUser(null);
        // Logika logout lebih lanjut
    };
    // ----------------------------------------------------

    // Menutup dropdown privilege jika klik di luar
    useEffect(() => {
        function handleClickOutside(event) {
            if (privilageRef.current && !privilageRef.current.contains(event.target)) {
                setPrivilageDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault(); // Mencegah submit form HTML standar jika ini adalah <form>
        // Logika untuk mengirim data aktor baru
        console.log("Aktor Baru Disubmit:", {
            nama: actorName,
            email: actorEmail,
            privilege: selectedPrivilage,
        });
        // Panggil onClose untuk menutup form setelah submit
        if (onClose) {
            onClose();
        }
        // Anda mungkin ingin mereset form di sini juga
        setActorName('');
        setActorEmail('');
        setSelectedPrivilage('Admin');
    };

    return (
        <div className="w-full h-full flex flex-col bg-white">
            <Navbar
                keyword={keyword}
                onKeywordChange={setKeyword} // Perbaiki typo jika ada 'onKeywordCahnge'
                authUser={authUser}
                roles={authUser ? authUser.tipe : null}
                fullName={authUser ? authUser.fullname : null}
                email={authUser ? authUser.email : null}
                saldo={authUser ? authUser.saldo : null}
                logout={handleLogout}
            />
            <div className="flex flex-1">
                <SidebarAdmin />
                <div className="flex-1 p-6">
                    <div className="h-full bg-white">
                        {/* Breadcrumb */}
                        <div className="mb-4 inline-flex justify-start items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose} // Memanggil prop onClose
                                className="text-[#969696] text-base font-normal font-['Geist'] leading-tight hover:text-[#555555] hover:underline cursor-pointer" // Menambahkan style agar terlihat bisa diklik
                            >
                                Actors
                            </button>
                            <span className="w-5 h-5 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 5L12 10L7 15" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <div className="text-[#171717] text-base font-medium font-['Geist'] leading-tight">Add Actors</div>
                        </div>

                        {/* Header Form dan Tombol Aksi */}
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                            <div className="flex-grow">
                                <h1 className="text-black text-2xl font-medium font-['Geist']">Add Actors</h1>
                                <p className="text-neutral-500 text-base font-medium font-['Geist']">Tambah aktor baru ke list</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit" // Menggunakan type="submit" jika ini di dalam tag <form>
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    onClick={!HTMLFormElement.prototype.isPrototypeOf(event?.target?.form) ? handleSubmit : undefined} // Panggil handleSubmit jika bukan dari submit form standar
                                >
                                    Submit
                                </button>
                            </div>
                        </div>

                        {/* Form Inputs - Anda bisa membungkus ini dengan tag <form onSubmit={handleSubmit}> */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mr-[240px]">
                            <div className="flex flex-col md:flex-row gap-6 ">
                                {/* Nama */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <label htmlFor="actorName" className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">Nama</label>
                                    <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                                        <input
                                            id="actorName"
                                            type="text"
                                            placeholder="Masukkan nama"
                                            className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-40"
                                            value={actorName}
                                            onChange={(e) => setActorName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                {/* Email */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <label htmlFor="actorEmail" className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">Email</label>
                                    <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                                        <input
                                            id="actorEmail"
                                            type="email"
                                            placeholder="Masukkan email"
                                            className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
                                            value={actorEmail}
                                            onChange={(e) => setActorEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Privilege Dropdown */}
                            <div className="w-full flex flex-col gap-2"> {/* Disesuaikan lebarnya */}
                                <label className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">Privilege</label>
                                <div className="relative self-stretch" ref={privilageRef}>
                                    <button
                                        type="button"
                                        className="w-full h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex justify-between items-center text-left border border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
                                        onClick={() => setPrivilageDropdownOpen((prev) => !prev)}
                                        aria-haspopup="listbox"
                                        aria-expanded={privilageDropdownOpen}
                                    >
                                        <span className="text-neutral-900 text-base font-medium font-['Geist']">{selectedPrivilage}</span>
                                        <svg width="20" height="20" fill="none" className={`transition-transform duration-200 ${privilageDropdownOpen ? 'rotate-180' : ''}`}>
                                            <path d="M7 8L10 11L13 8" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                    {privilageDropdownOpen && (
                                        <div
                                            role="listbox"
                                            className="absolute left-0 right-0 mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 flex flex-col overflow-hidden"
                                        >
                                            {["Admin", "Pegawai", "Anggota", "Penitip"].map((item) => (
                                                <div
                                                    key={item}
                                                    role="option"
                                                    aria-selected={selectedPrivilage === item}
                                                    className={`px-4 py-3 text-black text-base font-normal font-['Geist'] cursor-pointer hover:bg-gray-100 
                                                                ${selectedPrivilage === item ? 'bg-gray-100 font-semibold' : ''}`}
                                                    onClick={() => {
                                                        setSelectedPrivilage(item);
                                                        setPrivilageDropdownOpen(false);
                                                    }}
                                                    onKeyDown={(e) => { // Tambahkan navigasi keyboard
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            setSelectedPrivilage(item);
                                                            setPrivilageDropdownOpen(false);
                                                        }
                                                    }}
                                                    tabIndex={0} // Buat item bisa difokus
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}