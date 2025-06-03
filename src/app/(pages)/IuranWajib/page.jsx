"use client";

import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { showIuranWajib, updateIuranWajib } from "@/app/lib/api/config";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function formatRupiahForDisplay(angka) {
  if (angka === null || angka === undefined || angka === "") return "0";
  const number =
    typeof angka === "string"
      ? parseInt(String(angka).replace(/[^0-9]/g, ""), 10)
      : angka;
  if (isNaN(number)) return "0";
  return number.toLocaleString("id-ID");
}

function cleanRupiah(formattedAngka) {
  if (formattedAngka === null || formattedAngka === undefined) return "";
  return String(formattedAngka).replace(/[^0-9]/g, "");
}

const CONFIG_ID_IURAN_WAJIB = 1;

export default function IuranWajibPage({ onClose, onSaveSuccess }) {
  const [authUser, setAuthUser] = useState(null);
  const [keyword, setKeyword] = useInput("");

  const [jumlahIuran, setJumlahIuran] = useState("");
  const [selectedTanggal, setSelectedTanggal] = useState(1);

  const [configKeyName, setConfigKeyName] = useState("");

  const [tanggalDropdownOpen, setTanggalDropdownOpen] = useState(false);
  const tanggalDropdownRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAuthUser = async () => {
      const { error, data } = await getUserLogged();
      if (error) {
        console.error(
          "Token Invalid & Data user gagal terambil di IuranWajibPage:",
          data?.message || error
        );
      }
      setAuthUser(data);
    };
    fetchAuthUser();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoadingData(true);
      try {
        const result = await showIuranWajib(CONFIG_ID_IURAN_WAJIB);
        console.log("Raw response:", result);

        const configData = result.data?.data;

        if (!configData) {
          console.error(
            `Gagal mengambil pengaturan konfigurasi (ID: ${CONFIG_ID_IURAN_WAJIB})`
          );
          setJumlahIuran("0");
          setSelectedTanggal(1);
        } else {
          const iuranValue = configData.value || "0";
          setJumlahIuran(iuranValue);

          setConfigKeyName(configData.key || "");

          const tanggalValue = parseInt(configData.key2, 10);
          const validTanggal =
            !isNaN(tanggalValue) && tanggalValue >= 1 && tanggalValue <= 31
              ? tanggalValue
              : 1;
          setSelectedTanggal(validTanggal);

          console.log("Config loaded:", {
            key: configData.key,
            value: iuranValue,
            tanggal: validTanggal,
          });
        }
      } catch (error) {
        console.error("Error fetching config:", error);
        setJumlahIuran("0");
        setSelectedTanggal(1);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSettings();
  }, []);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        tanggalDropdownRef.current &&
        !tanggalDropdownRef.current.contains(event.target)
      ) {
        setTanggalDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleJumlahIuranChange = (e) => {
    const cleanedValue = cleanRupiah(e.target.value);
    setJumlahIuran(cleanedValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const iuranToSave = Number(jumlahIuran);
    if (isNaN(iuranToSave) || iuranToSave <= 0) {
      alert("Jumlah iuran wajib tidak valid.");
      setIsSaving(false);
      return;
    }
    if (!selectedTanggal || selectedTanggal < 1 || selectedTanggal > 31) {
      alert("Tanggal tenggat bayar tidak valid.");
      setIsSaving(false);
      return;
    }

    const payload = {
      id: CONFIG_ID_IURAN_WAJIB,
      value: String(iuranToSave),
      key2: selectedTanggal,
    };

    console.log(
      `Menyimpan data iuran wajib (ID: ${CONFIG_ID_IURAN_WAJIB}) dengan payload:`,
      payload
    );

    const result = await updateIuranWajib(payload);
    setIsSaving(false);

    if (result.error) {
      const message =
        result.message ||
        `Gagal menyimpan pengaturan. Status: ${result.status}`;
      console.error("Gagal menyimpan pengaturan iuran wajib:", result);
      alert(message);
    } else {
      alert("Pengaturan iuran wajib berhasil disimpan!");
      if (onSaveSuccess)
        onSaveSuccess({
          jumlah_iuran_wajib: iuranToSave,
          tanggal_tenggat_iuran: selectedTanggal,
        });
      if (onClose) onClose();
    }
  };

  const tanggalOptions = Array.from({ length: 31 }, (_, i) => i + 1);
  const formTitle = "Edit Detail Iuran Wajib";
  const formDescription = "Ubah ketentuan dari iuran wajib";

  if (isLoadingData) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-[#F8F8F8]">
        <Navbar
          authUser={authUser}
          logout={onLogoutHandler}
          keyword={keyword}
          onKeywordChange={setKeyword}
        />
        <div className="flex flex-1">
          <SidebarAdmin />
          <main className="flex-1 p-6 flex justify-center items-center">
            <p className="text-neutral-600 text-lg">Memuat...</p>
          </main>
        </div>
      </div>
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
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6 inline-flex justify-start items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/Actors")}
              className="text-[#969696] text-base font-normal font-['Geist'] leading-tight hover:text-neutral-700 cursor-pointer"
            >
              Iuran Wajib
            </button>
            <span className="w-5 h-5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7 5L12 10L7 15"
                  stroke="#969696"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="text-neutral-900 text-base font-medium font-['Geist'] leading-tight">
              {formTitle}
            </div>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex-grow">
              <h1 className="text-black text-2xl font-medium font-['Geist'] leading-snug">
                {formTitle}
              </h1>
              <p className="text-neutral-500 text-base font-normal font-['Geist'] leading-normal">
                {formDescription}
              </p>
            </div>
            <div className="flex">
              <button
                type="submit"
                form="iuran-wajib-form"
                disabled={isSaving || isLoadingData}
                className="w-[85px] px-6 py-2.5 bg-black text-white text-base font-medium font-['Geist'] rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isSaving ? "Menyimpan..." : "Save"}
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            id="iuran-wajib-form"
            className="flex flex-col gap-6 bg-white pr-24"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="jumlahIuran"
                  className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
                >
                  Jumlah Iuran Wajib
                </label>
                <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300 ">
                  <span className="text-neutral-500 text-base font-normal font-['Geist'] mr-2">
                    Rp
                  </span>
                  <input
                    id="jumlahIuran"
                    type="text"
                    inputMode="numeric"
                    placeholder="Masukkan jumlah"
                    className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
                    value={formatRupiahForDisplay(jumlahIuran)}
                    onChange={handleJumlahIuranChange}
                    required
                    disabled={isLoadingData}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="tanggalTenggat"
                  className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
                >
                  Tanggal Tenggat Bayar {/* Tambahkan spasi jika perlu */}
                  <span style={{ color: "#999999" }}>(per Bulan)</span>
                </label>
                <div className="relative self-stretch" ref={tanggalDropdownRef}>
                  <button
                    id="tanggalTenggat"
                    type="button"
                    className="w-full h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex justify-between items-center text-left border border-gray-300 cursor-pointer focus:outline-none "
                    onClick={() =>
                      !isLoadingData && setTanggalDropdownOpen((prev) => !prev)
                    }
                    aria-haspopup="listbox"
                    aria-expanded={tanggalDropdownOpen}
                    disabled={isLoadingData}
                  >
                    <span className="text-neutral-900 text-base font-medium font-['Geist']">
                      {selectedTanggal
                        ? `Tanggal ${selectedTanggal}`
                        : "Pilih Tanggal"}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className={`transition-transform duration-200 ease-in-out ${
                        tanggalDropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {tanggalDropdownOpen && (
                    <div
                      role="listbox"
                      className="absolute left-0 right-0 mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 flex flex-col overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {tanggalOptions.map((tanggal) => (
                        <div
                          key={tanggal}
                          role="option"
                          aria-selected={selectedTanggal === tanggal}
                          className={`px-4 py-3 text-neutral-900 text-base font-normal font-['Geist'] cursor-pointer hover:bg-gray-100 ${
                            selectedTanggal === tanggal
                              ? "bg-gray-100 font-medium"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedTanggal(tanggal);
                            setTanggalDropdownOpen(false);
                          }}
                        >
                          {tanggal}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
