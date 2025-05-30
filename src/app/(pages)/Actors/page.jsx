'use client';

import FormActor from "@/app/components/FormActor";
import Navbar from "@/app/components/Navbar";
import Privilage from "@/app/components/Privilage";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { deleteUser, getUser } from "@/app/lib/api/user";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react"; // Tambahkan useMemo

export default function ActorsPage() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAddActor, setShowAddActor] = useState(false);
    const [showEditActor, setShowEditActor] = useState(null);
    const [actors, setActors] = useState([]);
    const [allActors, setAllActors] = useState([]); // State untuk menyimpan semua data aktor
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);

    // --- State dan Handler untuk Navbar ---
    const [keyword, setKeyword] = useInput(''); // Inisialisasi useInput dengan string kosong
    const [authUser, setAuthUser] = useState(null);

    // --- Pagination States ---
    const [currentPage, setCurrentPage] = useState(1);
    const [actorsPerPage] = useState(8); // Maximum 8 actors per page

    async function onLogoutHandler() {
        await logout();
        setAuthUser(null);
    }

    // Fungsi untuk mengambil semua data aktor dari API
    const fetchAllActors = async () => {
        setIsLoading(true);
        const { error, data } = await getUser();

        if (error) {
            console.error("Tidak dapat mengambil user dari server:", error);
            setAllActors([]); // Set allActors to empty array on error
        } else {
            setAllActors(data); // Simpan semua data aktor
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAllActors(); // Panggil saat komponen pertama kali di-mount
    }, []);

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
    
    // Close dropdown "Actions" if click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // --- Filter aktor berdasarkan keyword ---
    const filteredActors = useMemo(() => {
        if (!keyword) {
            return allActors; // Jika keyword kosong, tampilkan semua aktor
        }
        const lowercasedKeyword = keyword.toLowerCase();
        return allActors.filter(actor =>
            actor.fullname.toLowerCase().includes(lowercasedKeyword) ||
            actor.email.toLowerCase().includes(lowercasedKeyword) ||
            actor.tipe.toLowerCase().includes(lowercasedKeyword)
        );
    }, [allActors, keyword]);

    // Update `actors` state setiap kali `filteredActors` berubah
    useEffect(() => {
        setActors(filteredActors);
        setCurrentPage(1); // Reset halaman ke 1 setiap kali filter berubah
    }, [filteredActors]);

    // Logic for displaying current actors
    const indexOfLastActor = currentPage * actorsPerPage;
    const indexOfFirstActor = indexOfLastActor - actorsPerPage;
    const currentActors = actors.slice(indexOfFirstActor, indexOfLastActor);

    // Logic for displaying page numbers
    const totalPages = Math.ceil(actors.length / actorsPerPage); // Berdasarkan data yang difilter

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Determine which page numbers to display in the pagination control
    const getPaginationGroup = () => {
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);
        const pages = [];

        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('...');
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    // --- Fungsi untuk menghapus aktor ---
    const handleDeleteActor = async (actorId) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus aktor ini?")) {
            const { error } = await deleteUser(actorId);

            if (error) {
                alert("Gagal menghapus aktor. Silakan coba lagi.");
                console.error("Error deleting actor:", error);
            } else {
                alert("Aktor berhasil dihapus!");
                fetchAllActors(); // Muat ulang semua data setelah penghapusan
            }
        }
    };


    if (showAddActor) {
        return (
            <FormActor
                onClose={() => {
                    setShowAddActor(false);
                    setShowEditActor(null);
                    fetchAllActors(); // Muat ulang data setelah form ditutup
                }}
                initialData={showEditActor}
            />
        );
    }

    return (
        <div className="w-full min-h-screen flex flex-col bg-white">
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
                <main className="flex-1 p-5 overflow-auto">
                    <div className="w-full">
                        <div className="w-full mb-6 flex justify-between items-end">
                            <div className="flex justify-start items-start gap-9">
                                {/* Iuran Wajib */}
                                <div className="inline-flex flex-col justify-start items-start gap-2">
                                    <div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">Iuran Wajib:</div>
                                    <div className="min-w-40 px-3 py-2 bg-white rounded-lg outline-offset-[-1px] outline-1 outline-[#D0D0D0] inline-flex justify-start items-center gap-2">
                                        <div className="text-stone-500 text-base font-normal font-['Geist'] leading-tight">Rp</div>
                                        <div className="text-neutral-900 text-base font-medium font-['Geist'] leading-normal">172.659.267</div>
                                    </div>
                                </div>
                                {/* Tenggat Bayar */}
                                <div className="inline-flex flex-col justify-start items-start gap-2">
                                    <div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">Tenggat Bayar:</div>
                                    <div className="px-3 py-2 bg-white rounded-lg outline-offset-[-1px] outline-1 outline-[#D0D0D0] inline-flex justify-start items-center gap-2">
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
                                    className="px-3 py-2 bg-black rounded-lg outline-1 outline-offset-[-1px] flex justify-start items-center gap-1 overflow-hidden"
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
                                        className="absolute p-2 right-0 mt-2 bg-white rounded-md shadow-lg inline-flex flex-col justify-start items-start gap-1 z-30"
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
                            {currentActors.map((actor) => (
                                <div key={actor.id} className="self-stretch h-16 border-b border-[#E5E5E5] inline-flex justify-start items-center">
                                    <div className="w-14 self-stretch max-w-16 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.id}</div></div>
                                    <div className="flex-1 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.fullname}</div></div>
                                    <div className="flex-1 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.email}</div></div>
                                    <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                                        <div className={`text-base font-medium font-['Geist'] leading-normal ${actor.status === "Sudah Bayar" ? "text-black" : "text-red-600"}`}>
                                            {actor.status}
                                        </div>
                                    </div>
                                    <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.saldo}</div></div>
                                    <div className="flex-1 self-stretch max-w-28 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">{actor.saldoWajib}</div></div>
                                    <div className="flex-1 self-stretch max-w-28 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><Privilage value={actor.tipe} /></div>
                                    <div className="w-24 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                        <Image
                                            src="/Trash.svg"
                                            alt="Hapus"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 cursor-pointer" 
                                            onClick={() => handleDeleteActor(actor.id)}
                                        />
                                        <Image
                                            src="/Pensil.svg"
                                            alt="Edit"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 cursor-pointer"
                                            onClick={() => {
                                                setShowEditActor(actor);
                                                setShowAddActor(true);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="w-full mt-6 flex justify-center items-center gap-2">
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                                        aria-label="Previous Page"
                                    >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </button>

                                    {getPaginationGroup().map((item, index) => (
                                        <div key={index}>
                                            {item === '...' ? (
                                                <div className="text-gray-500 text-base font-medium font-['Geist'] leading-normal">...</div>
                                            ) : (
                                                <button
                                                    onClick={() => paginate(item)}
                                                    className={`size-6 flex items-center justify-center rounded transition ${
                                                        currentPage === item
                                                            ? "bg-gray-300 text-black"
                                                            : "hover:bg-gray-200 text-gray-500"
                                                    }`}
                                                >
                                                    <div className="text-base font-medium font-['Geist'] leading-normal">{item}</div>
                                                </button>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages}
                                        className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                                        aria-label="Next Page"
                                    >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 4L10 8L6 12" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}