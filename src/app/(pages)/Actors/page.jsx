"use client";

import ConfirmationDialog from "@/app/components/ConfirmationDialog";
import FormActor from "@/app/components/FormActor";
import Navbar from "@/app/components/Navbar";
import Privilage from "@/app/components/Privilage";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import TarikSaldo from "@/app/components/TarikSaldo";
import useInput from "@/app/hooks/useInput";
import { showIuranWajib } from "@/app/lib/api/config";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { getPayment } from "@/app/lib/api/payment";
import { deleteUser, getUser, updateUser } from "@/app/lib/api/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

function formatRupiah(angka) {
  if (angka === null || angka === undefined || isNaN(Number(angka)))
    return "Rp. 0";
  return `Rp. ${Number(angka).toLocaleString("id-ID")}`;
}

export default function ActorsPage() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddActor, setShowAddActor] = useState(false);
  const [showEditActor, setShowEditActor] = useState(null);
  const [showTarikSaldoModal, setShowTarikSaldoModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [actorToDelete, setActorToDelete] = useState(null);

  const [iuranWajib, setIuranWajib] = useState({
    jumlah: "0",
    tanggal: 1,
  });

  const [allActors, setAllActors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);

  const [keyword, setKeyword] = useInput("");
  const [authUser, setAuthUser] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [actorsPerPage] = useState(8);

  const tarikSaldoData = useMemo(() => {
    if (authUser) {
      return {
        namaAnggota: authUser.fullname || "Admin",

        saldoSaatIni: authUser.saldo !== undefined ? Number(authUser.saldo) : 0,
        imageUrl: authUser.profileImageUrl || "/default-avatar.png",
      };
    }
    return {
      namaAnggota: "Admin",
      saldoSaatIni: 0,
      imageUrl: "/default-avatar.png",
    };
  }, [authUser]);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  const fetchAllActors = async () => {
    setIsLoading(true);
    let usersData = [];
    let paymentsData = [];

    try {
      const { error: userError, data: users } = await getUser();
      if (userError) {
        console.error("Tidak dapat mengambil user dari server:", userError);
      } else {
        usersData = Array.isArray(users) ? users : [];
      }

      const { error: paymentError, data: payments } = await getPayment();
      if (paymentError) {
        console.error(
          "Tidak dapat mengambil pembayaran dari server:",
          paymentError
        );
      } else {
        paymentsData = Array.isArray(payments) ? payments : [];
      }

      const paymentStatusMap = new Map();
      paymentsData.forEach((payment) => {
        if (payment.user_id && payment.payment_status) {
          paymentStatusMap.set(payment.user_id, payment.payment_status);
        }
      });

      const mergedActors = usersData.map((actor) => ({
        ...actor,
        payment_status: paymentStatusMap.get(actor.id) || "belum bayar",
        saldoWajib: actor.saldoWajib !== undefined ? actor.saldoWajib : "N/A",
      }));
      setAllActors(mergedActors);
    } catch (error) {
      console.error(
        "Terjadi kesalahan saat mengambil data aktor atau pembayaran:",
        error
      );
      setAllActors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllActors();
  }, []);

  useEffect(() => {
    const fetchUserLogged = async () => {
      const { error, data } = await getUserLogged();
      if (error) {
        console.log("Token Invalid & Data user gagal terambil");

        return;
      }
      setAuthUser(data);
    };
    fetchUserLogged();
  }, []);

  useEffect(() => {
    const fetchIuranWajib = async () => {
      try {
        const result = await showIuranWajib();
        if (!result.error && result.data?.data) {
          const configData = result.data.data;
          setIuranWajib({
            jumlah: configData.value || "0",
            tanggal: parseInt(configData.key2, 10) || 1,
          });
        }
      } catch (error) {
        console.error("Error fetching iuran wajib:", error);
      }
    };

    fetchIuranWajib();
  }, []);

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

  const filteredActors = useMemo(() => {
    if (!keyword) {
      return allActors;
    }
    const lowercasedKeyword = keyword.toLowerCase();
    return allActors.filter(
      (actor) =>
        (actor.fullname &&
          actor.fullname.toLowerCase().includes(lowercasedKeyword)) ||
        (actor.email &&
          actor.email.toLowerCase().includes(lowercasedKeyword)) ||
        (actor.tipe && actor.tipe.toLowerCase().includes(lowercasedKeyword)) ||
        (actor.status_keanggotaan &&
          actor.status_keanggotaan.toLowerCase().includes(lowercasedKeyword)) ||
        (actor.payment_status &&
          actor.payment_status.toLowerCase().includes(lowercasedKeyword))
    );
  }, [allActors, keyword]);

  const indexOfLastActor = currentPage * actorsPerPage;
  const indexOfFirstActor = indexOfLastActor - actorsPerPage;

  const currentActors = useMemo(() => {
    return filteredActors.slice(indexOfFirstActor, indexOfLastActor);
  }, [filteredActors, indexOfFirstActor, indexOfLastActor]);

  const totalPages = Math.ceil(filteredActors.length / actorsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword]);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  const getPaginationGroup = () => {
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    const pages = [];

    if (totalPages <= 5) {
      start = 1;
      end = totalPages;
    } else {
      if (currentPage <= 3) {
        start = 1;
        end = 5;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages;
      }
    }

    if (start > 1 && totalPages > 5) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }

    for (let i = start; i <= end; i++) {
      if (i > 0) pages.push(i);
    }

    if (end < totalPages && totalPages > 5) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const handleDeleteActor = (actor) => {
    setActorToDelete(actor);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!actorToDelete) return;

    const { error } = await deleteUser(actorToDelete.id);
    if (error) {
      alert("Gagal menghapus aktor. Silakan coba lagi.");
      console.error("Error deleting actor:", error);
    } else {
      alert("Aktor berhasil dihapus!");
      fetchAllActors();
    }
    setShowDeleteConfirmation(false);
    setActorToDelete(null);
  };

  const handleKembaliTarikSaldo = () => {
    setShowTarikSaldoModal(false);
  };

  const handleKonfirmasiTarikSaldo = async (jumlahDitarik, selectedActor) => {
    if (!selectedActor || !selectedActor.id) {
      alert("Silakan pilih anggota terlebih dahulu.");
      return;
    }

    const saldoSaatIniAnggota =
      selectedActor.saldo !== undefined ? Number(selectedActor.saldo) : 0;
    const jumlahPenarikanNumerik = Number(jumlahDitarik);

    if (isNaN(saldoSaatIniAnggota) || isNaN(jumlahPenarikanNumerik)) {
      alert("Data saldo atau jumlah penarikan tidak valid.");
      return;
    }

    if (jumlahPenarikanNumerik <= 0) {
      alert("Jumlah penarikan harus lebih dari 0.");
      return;
    }

    if (jumlahPenarikanNumerik > saldoSaatIniAnggota) {
      alert(
        `Jumlah penarikan (${formatRupiah(
          jumlahPenarikanNumerik
        )}) tidak boleh melebihi saldo anggota saat ini (${formatRupiah(
          saldoSaatIniAnggota
        )}).`
      );
      return;
    }

    const saldoBaru = saldoSaatIniAnggota - jumlahPenarikanNumerik;

    const payload = {
      ...selectedActor,
      saldo: saldoBaru,
    };

    console.log(
      `Mengupdate saldo untuk ${selectedActor.fullname} (ID: ${
        selectedActor.id
      }). Saldo lama: ${formatRupiah(
        saldoSaatIniAnggota
      )}, Ditarik: ${formatRupiah(
        jumlahPenarikanNumerik
      )}, Saldo baru: ${formatRupiah(saldoBaru)}`
    );
    console.log("Payload untuk updateUser:", payload);

    const { error, data, message } = await updateUser(payload);

    if (error) {
      alert(
        `Gagal melakukan penarikan untuk ${selectedActor.fullname}: ${
          message || "Terjadi kesalahan pada server."
        }`
      );
      console.error("Error updating user saldo:", error, message);
    } else {
      alert(
        `Penarikan saldo sebesar ${formatRupiah(
          jumlahPenarikanNumerik
        )} untuk ${
          selectedActor.fullname
        } berhasil! Saldo sekarang: ${formatRupiah(saldoBaru)}`
      );
      setShowTarikSaldoModal(false);
      fetchAllActors();

      if (authUser && authUser.id === selectedActor.id) {
        setAuthUser((prevAuthUser) => ({
          ...prevAuthUser,
          saldo: saldoBaru,
        }));
      }
    }
  };

  if (showAddActor) {
    return (
      <FormActor
        onClose={() => {
          setShowAddActor(false);
          setShowEditActor(null);
          fetchAllActors();
        }}
        initialData={showEditActor}
      />
    );
  }

  return (
    <>
      {" "}
      {/* Tambahkan React Fragment jika belum ada */}
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
          <main className="flex-1 p-5 overflow-y-auto">
            <div className="w-full">
              <div className="w-full mb-6 flex justify-between items-end">
                <div className="flex justify-start items-start gap-9">
                  {/* Iuran Wajib & Tenggat Bayar */}
                  <div className="inline-flex flex-col justify-start items-start gap-2">
                    <div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">
                      Iuran Wajib:
                    </div>
                    <div className="min-w-40 px-3 py-2 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-[#D0D0D0] inline-flex justify-start items-center gap-2">
                      <div className="text-stone-500 text-base font-normal font-['Geist'] leading-tight">
                        Rp
                      </div>
                      <div className="text-neutral-900 text-base font-medium font-['Geist'] leading-normal">
                        {formatRupiah(iuranWajib.jumlah).replace("Rp. ", "")}
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex flex-col justify-start items-start gap-2">
                    <div className="text-stone-500 text-base font-normal font-['Geist'] leading-normal">
                      Tenggat Bayar:
                    </div>
                    <div className="px-3 py-2 bg-white rounded-lg outline-1 outline-offset-[-1px] outline-[#D0D0D0] inline-flex justify-start items-center gap-2">
                      <div className="size-5 relative">
                        <Image
                          src="/Calendar.svg"
                          alt="Calendar"
                          width={20}
                          height={20}
                        />
                      </div>
                      <div>
                        <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
                          Tgl{" "}
                        </span>
                        <span className="text-black text-base font-medium font-['Geist'] leading-normal">
                          {iuranWajib.tanggal}
                        </span>
                        <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
                          {" "}
                          / Bulan
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Actions Button and Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowDropdown((v) => !v)}
                    className="px-3 py-2 bg-black rounded-lg outline-1 outline-offset-[-1px] flex justify-start items-center gap-1 overflow-hidden cursor-pointer transition-transform duration-150 ease-in-out active:scale-95"
                  >
                    <span className="w-6 h-6 flex items-center justify-center">
                      <Image
                        src="/listrik.svg"
                        alt="Actions"
                        width={24}
                        height={24}
                        style={{ filter: "brightness(0) invert(1)" }}
                        priority
                      />
                    </span>
                    <div className="px-2 flex justify-center items-center">
                      <div className="text-white text-base font-medium font-['Geist'] leading-normal">
                        Actions
                      </div>
                    </div>
                    <span
                      className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 ease-in-out ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`absolute p-2 right-0 mt-2 bg-white rounded-md shadow-lg inline-flex flex-col justify-start items-start gap-1 z-30
                                  transition-all duration-300 ease-in-out transform
                                  ${
                                    showDropdown
                                      ? "opacity-100 scale-100"
                                      : "opacity-0 scale-95 pointer-events-none"
                                  }`}
                    style={{ minWidth: "198px" }}
                    aria-hidden={!showDropdown}
                  >
                    <div
                      className="w-full px-3 py-2 text-left text-black text-sm font-normal font-['Geist'] leading-tight cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => {
                        setShowEditActor(null);
                        setShowAddActor(true);
                        setShowDropdown(false);
                      }}
                    >
                      Tambah Aktor
                    </div>
                    <div
                      className="w-full px-3 py-2 text-left text-black text-sm font-normal font-['Geist'] leading-tight cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => {
                        router.push("/IuranWajib");
                        setShowDropdown(false);
                      }}
                    >
                      Edit Detail Iuran Wajib
                    </div>
                    {/* 4. Modifikasi item dropdown "Tarik Saldo" */}
                    <div
                      className="w-full px-3 py-2 text-left text-black text-sm font-normal font-['Geist'] leading-tight cursor-pointer hover:bg-gray-100 rounded"
                      onClick={() => {
                        setShowTarikSaldoModal(true);
                        setShowDropdown(false);
                      }}
                    >
                      Tarik Saldo
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="w-full flex flex-col">
                {/* Table Header */}
                <div className="w-full border-b border-[#E5E5E5] flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch inline-flex justify-start items-center">
                    <div className="w-14 h-14 max-w-16 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        ID
                      </div>
                    </div>
                    <div className="flex-1 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Nama anggota
                      </div>
                    </div>
                    <div className="flex-1 h-14 min-w-48 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Email
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-40 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Status Pembayaran
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-40 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Status Anggota
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-40 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Saldo sukarela
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-32 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Saldo wajib
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-32 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Privilege
                      </div>
                    </div>
                    <div className="w-24 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Aksi
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table Rows */}
                {isLoading ? (
                  <div className="w-full text-center py-10 text-gray-500 font-medium">
                    Memuat data aktor...
                  </div>
                ) : currentActors.length === 0 ? (
                  <div className="w-full text-center py-10 text-gray-500 font-medium">
                    {keyword
                      ? `Tidak ada aktor yang cocok dengan "${keyword}".`
                      : "Tidak ada data aktor."}
                  </div>
                ) : (
                  currentActors.map((actor) => (
                    <div
                      key={actor.id}
                      className="self-stretch h-auto min-h-16 border-b border-[#E5E5E5] inline-flex justify-start items-center hover:bg-gray-50 transition"
                    >
                      <div className="w-14 self-stretch max-w-16 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">
                          {actor.id}
                        </div>
                      </div>
                      <div className="flex-1 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div
                          className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal truncate"
                          title={actor.fullname}
                        >
                          {actor.fullname}
                        </div>
                      </div>
                      <div className="flex-1 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div
                          className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal truncate"
                          title={actor.email}
                        >
                          {actor.email}
                        </div>
                      </div>
                      <div className="flex-1 self-stretch max-w-40 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div
                          className={`flex-1 text-center text-base font-medium font-['Geist'] leading-normal ${
                            actor.tipe === "admin" || actor.tipe === "pegawai"
                              ? "text-gray-700"
                              : actor.payment_status === "settlement" ||
                                actor.payment_status === "capture"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {actor.tipe === "admin" || actor.tipe === "pegawai"
                            ? "-"
                            : actor.payment_status === "settlement" ||
                              actor.payment_status === "capture"
                            ? "Sudah Bayar"
                            : "Belum Bayar"}
                        </div>
                      </div>
                      <div className="flex-1 self-stretch max-w-40 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div
                          className={`flex-1 text-center text-base font-medium font-['Geist'] leading-normal ${
                            actor.status_keanggotaan === "aktif"
                              ? "text-green-600"
                              : actor.status_keanggotaan === "tidak aktif"
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {actor.status_keanggotaan
                            ? actor.status_keanggotaan.charAt(0).toUpperCase() +
                              actor.status_keanggotaan.slice(1)
                            : "N/A"}
                        </div>
                      </div>
                      <div className="flex-1 self-stretch max-w-40 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">
                          {formatRupiah(actor.saldo)}{" "}
                        </div>
                      </div>
                      <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div className="flex-1 text-center text-black text-base font-medium font-['Geist'] leading-normal">
                          {formatRupiah(actor.saldoWajib)}{" "}
                        </div>
                      </div>
                      <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <Privilage value={actor.tipe} />
                      </div>
                      <div className="w-24 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleDeleteActor(actor)}
                          aria-label={`Hapus ${actor.fullname}`}
                          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <Image
                            src="/Trash.svg"
                            alt="Hapus"
                            width={20}
                            height={20}
                          />
                        </button>
                        <button
                          onClick={() => {
                            setShowEditActor(actor);
                            setShowAddActor(true);
                          }}
                          aria-label={`Edit ${actor.fullname}`}
                          className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                        >
                          <Image
                            src="/Pensil.svg"
                            alt="Edit"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {/* Pagination */}
                {totalPages > 1 && !isLoading && currentActors.length > 0 && (
                  <div className="w-full mt-6 flex justify-center items-center gap-2">
                    <div className="flex justify-center items-center gap-1 sm:gap-2">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="p-1 sm:size-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-50"
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
                      {getPaginationGroup().map((item, index) => (
                        <div key={index}>
                          {item === "..." ? (
                            <div className="text-gray-500 text-base sm:text-base font-medium font-['Geist'] leading-normal px-1">
                              ...
                            </div>
                          ) : (
                            <button
                              onClick={() => paginate(item)}
                              className={`px-2 py-1 sm:size-6 min-w-[24px] sm:min-w-[unset] flex items-center justify-center rounded transition text-base sm:text-base ${
                                currentPage === item
                                  ? "bg-gray-300 text-black font-semibold"
                                  : "hover:bg-gray-200 text-gray-500"
                              }`}
                            >
                              {item}
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="p-1 sm:size-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-50"
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
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      {showTarikSaldoModal && (
        <TarikSaldo
          actorsList={allActors.filter(
            (actor) => actor.tipe !== "admin" && actor.tipe !== "pegawai"
          )}
          initialJumlahPenarikan={0}
          onKembali={() => setShowTarikSaldoModal(false)}
          onKonfirmasi={handleKonfirmasiTarikSaldo}
        />
      )}
      {showDeleteConfirmation && actorToDelete && (
        <ConfirmationDialog
          isOpen={showDeleteConfirmation}
          title="Hapus Aktor"
          message={`Apakah Anda yakin ingin menghapus? <br>Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setActorToDelete(null);
          }}
          isDestructive={true}
        />
      )}
    </>
  );
}
