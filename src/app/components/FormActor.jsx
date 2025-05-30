'use client';

import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { postPaymentMember } from "@/app/lib/api/payment";
import { addUser, updateUser } from "@/app/lib/api/user";
import { useEffect, useRef, useState } from 'react';

// Komponen AddActor, diubah namanya menjadi FormActor agar lebih generik
export default function FormActor({ onClose, initialData = null }) { // Tambahkan prop initialData
    // State untuk input form
    // Inisialisasi state dengan initialData jika ada, jika tidak, gunakan string kosong
    const [actorName, setActorName] = useState(initialData ? initialData.fullname : '');
    const [actorEmail, setActorEmail] = useState(initialData ? initialData.email : '');

    // State untuk dropdown privilege
    const [privilageDropdownOpen, setPrivilageDropdownOpen] = useState(false);
    // Inisialisasi privilege dengan initialData jika ada, jika tidak, gunakan "Admin"
    const [selectedPrivilage, setSelectedPrivilage] = useState(
            initialData 
                ? initialData.tipe.charAt(0).toUpperCase() + initialData.tipe.slice(1).toLowerCase() 
                : "Admin"
        );
    const privilageRef = useRef(null);

    // --- State dan Handler untuk Navbar ---
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        const privilegeToSend = selectedPrivilage.toLowerCase();

        if (initialData) {
            // ... (existing update logic)
            updateUser({
                id: initialData.id,
                fullname: actorName,
                email: actorEmail,
                tipe: privilegeToSend,
            });
        } else {
            // Mode Tambah: Kirim data aktor baru
            const { error, data: newUserId } = await addUser({ // Destructure to get newUserId
                fullname: actorName,
                email: actorEmail,
                tipe: privilegeToSend,
            });

            if (error) {
                console.error("Failed to add user:", error);
                alert("Gagal menambahkan aktor. Silakan coba lagi.");
                return;
            }

            if (newUserId) { // Check if newUserId is available
                // Now you have the user_id, you can call postPaymentMember
                const paymentResult = await postPaymentMember({
                    user_id: newUserId,
                    payment_method: 'link', // Or dynamically set based on your form
                    amount: 0 // Set initial amount, perhaps a mandatory first payment or 0
                });

                if (paymentResult.error) {
                    console.error("Failed to post payment for new member:", paymentResult.error);
                    alert("Aktor berhasil ditambahkan, tetapi gagal mencatat pembayaran awal.");
                } else {
                    alert("Aktor dan pembayaran awal berhasil ditambahkan!");
                }
            } else {
                alert("Aktor berhasil ditambahkan, tetapi ID pengguna tidak ditemukan untuk pembayaran.");
            }
        }
        if (onClose) {
            onClose();
        }
    };

    // Tentukan judul form berdasarkan mode
    const formTitle = initialData ? "Edit Actor" : "Add Actor";
    const formDescription = initialData ? "Perbarui informasi aktor ini" : "Tambah aktor baru ke list";
    const submitButtonText = initialData ? "Submit" : "Submit";

    return (
        <div className="w-full h-full flex flex-col bg-white">
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
            <div className="flex flex-1">
                <SidebarAdmin />
                <div className="flex-1 p-6">
                    <div className="h-full bg-white">
                        {/* Breadcrumb */}
                        <div className="mb-4 inline-flex justify-start items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-[#969696] text-base font-normal font-['Geist'] leading-tight hover:text-[#555555] hover:underline cursor-pointer"
                            >
                                Actors
                            </button>
                            <span className="w-5 h-5 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7 5L12 10L7 15" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <div className="text-[#171717] text-base font-medium font-['Geist'] leading-tight">{formTitle}</div>
                        </div>

                        {/* Header Form dan Tombol Aksi */}
                        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                            <div className="flex-grow">
                                <h1 className="text-black text-2xl font-medium font-['Geist']">{formTitle}</h1>
                                <p className="text-neutral-500 text-base font-medium font-['Geist']">{formDescription}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    form="actor-form" // Kaitkan tombol submit dengan ID form
                                    onClick={handleSubmit} // Panggil handleSubmit saat tombol diklik
                                >
                                    {submitButtonText}
                                </button>
                            </div>
                        </div>

                        {/* Form Inputs */}
                        <form onSubmit={handleSubmit} id="actor-form" className="flex flex-col gap-6 mr-[240px]">
                            <div className="flex flex-col md:flex-row gap-6 ">
                                {/* Nama */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <label htmlFor="actorName" className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">Nama</label>
                                    <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                                        <input
                                            id="actorName"
                                            type="text"
                                            placeholder="Masukkan nama"
                                            className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
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
                            <div className="w-full flex flex-col gap-2">
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
                                            {["Admin", "Pegawai", "Pengguna", "Penitip"].map((item) => (
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
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            setSelectedPrivilage(item);
                                                            setPrivilageDropdownOpen(false);
                                                        }
                                                    }}
                                                    tabIndex={0}
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