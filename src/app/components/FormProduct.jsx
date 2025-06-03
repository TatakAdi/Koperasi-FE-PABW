"use client";

import { getCategory } from "@/app/lib/api/category";
import { updateProduct } from "@/app/lib/api/product";
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

export default function FormProduct({ productData, onClose, onSaveSuccess }) {
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [kategori, setKategori] = useState("");

  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [isLoadingKategori, setIsLoadingKategori] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("idle");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchKategoriList = async () => {
      setIsLoadingKategori(true);
      const response = await getCategory();

      if (
        response &&
        response.data &&
        !response.error &&
        Array.isArray(response.data)
      ) {
        const formattedOptions = response.data.map((cat, index) => {
          const keySuffix =
            cat.id !== null && cat.id !== undefined ? cat.id : `idx-${index}`;
          const categoryName = cat.name || `Kategori Tanpa Nama ${index + 1}`;
          return {
            reactKey: `cat-${keySuffix}`,
            label: categoryName,
            value: cat.name || "",
          };
        });
        setKategoriOptions(formattedOptions);
      } else {
        console.error(
          "Gagal mengambil daftar kategori atau format data tidak sesuai:",
          response?.error || response
        );
        setKategoriOptions([
          {
            reactKey: "cat-error-placeholder",
            label: "Gagal memuat kategori",
            value: "",
          },
        ]);
      }
      setIsLoadingKategori(false);
    };
    fetchKategoriList();
  }, []);

  function getKategoriLabel(selectedValue) {
    if (isLoadingKategori) return "Memuat kategori...";
    const foundOption = kategoriOptions.find(
      (option) => option.value === selectedValue
    );
    return foundOption ? foundOption.label : "Pilih Kategori...";
  }

  useEffect(() => {
    if (productData) {
      setHarga(productData.price ? String(productData.price) : "");
      setStok(productData.stock ? String(productData.stock) : "");

      const initialCategoryValue = productData.category?.name || "";

      if (!isLoadingKategori) {
        if (kategoriOptions.length > 0) {
          const categoryExists = kategoriOptions.some(
            (opt) => opt.value === initialCategoryValue
          );
          setKategori(categoryExists ? initialCategoryValue : "");
        } else {
          setKategori("");
        }
      }
    } else {
      setHarga("");
      setStok("");
      setKategori("");
    }
  }, [productData, kategoriOptions, isLoadingKategori]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!kategori) {
      showNotification("Kategori harus dipilih.", "error");
      return;
    }

    const finalHarga = parseInt(cleanRupiah(harga), 10);
    const finalStok = parseInt(stok, 10);

    if (isNaN(finalHarga) || finalHarga < 0) {
      showNotification("Harga tidak valid. Masukkan angka positif.", "error");
      return;
    }
    if (isNaN(finalStok) || finalStok < 0) {
      showNotification("Stok tidak valid. Masukkan angka positif.", "error");
      return;
    }

    setStatus("loading");
    setIsSaving(true);
    const payload = {
      id: productData.id,
      price: finalHarga,
      stock: finalStok,
      category: kategori,
    };

    console.log("Updating product with data (from FormProduct):", payload);
    const response = await updateProduct(payload);

    setIsSaving(false);
    setStatus("idle");

    if (response && !response.error) {
      showNotification("Produk berhasil diperbarui!", "success");
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } else {
      let detailErrorMessage = "Terjadi kesalahan yang tidak diketahui.";
      if (response && response.error) {
        if (
          typeof response.error === "string" &&
          response.error.trim() !== ""
        ) {
          detailErrorMessage = response.error;
        } else if (response.status) {
          detailErrorMessage = `Gagal menyimpan produk. Status: ${response.status}`;
        } else {
          detailErrorMessage =
            "Gagal menyimpan produk. Tidak ada detail dari server.";
        }
      }
      console.error(
        "Gagal menyimpan produk:",
        response ? response : "Respons tidak diketahui"
      );
      showNotification(detailErrorMessage, "error");
    }
  };

  const formTitle = "Edit Produk";
  const formDescription = "Perbarui informasi";
  const submitButtonText = "Simpan Perubahan";

  return (
    <div className="flex-1 p-5 bg-white rounded-xl flex flex-col justify-start items-start gap-6 overflow-auto mt-4">
      {/* Breadcrumb */}
      <div className="self-stretch inline-flex justify-start items-center gap-2">
        <button
          type="button"
          className="text-[#969696] text-base font-normal font-['Geist'] leading-tight hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          Data Produk
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
        <div className="text-[#171717] text-base font-medium font-['Geist'] leading-tight">
          {formTitle}
        </div>
      </div>

      <div className="self-stretch inline-flex justify-between items-end">
        <div className="inline-flex flex-col justify-start items-start gap-2">
          <div className="text-black text-2xl font-medium font-['Geist']">
            {formTitle}
          </div>
          <p className="text-neutral-500 text-base font-medium font-['Geist']">
            {formDescription}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            form="product-edit-form"
            disabled={isLoadingKategori || status === "loading"}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : isLoadingKategori ? (
              "Memuat..."
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        id="product-edit-form"
        className="w-full flex flex-col gap-6 md:mr-[15%] lg:mr-[240px]"
      >
        {/* Row 1: Harga & Stok */}
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <label
              htmlFor="harga"
              className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
            >
              Harga
            </label>
            <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300  ">
              <span className="text-neutral-900 text-base font-medium font-['Geist'] leading-normal mr-2">
                Rp
              </span>
              <input
                id="harga"
                type="text"
                inputMode="numeric"
                className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
                value={formatRupiahForDisplay(harga)}
                onChange={(e) => setHarga(cleanRupiah(e.target.value))}
                placeholder="0"
                required
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label
              htmlFor="stok"
              className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
            >
              Stok
            </label>
            <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300  ">
              <input
                id="stok"
                type="text"
                inputMode="numeric"
                className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
                value={stok}
                onChange={(e) =>
                  setStok(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Row 2: Kategori Dropdown */}
        <div className="w-full pr-0 md:pr-3 flex flex-col gap-2">
          <label
            htmlFor="kategori-input"
            className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
          >
            Kategori
          </label>
          <div className="relative self-stretch" ref={dropdownRef}>
            <button
              id="kategori-input"
              type="button"
              className="w-full h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex justify-between items-center text-left border border-gray-300 cursor-pointer"
              onClick={() =>
                !isLoadingKategori && setDropdownOpen((prev) => !prev)
              }
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              disabled={isLoadingKategori}
            >
              <span className="text-neutral-900 text-base font-medium font-['Geist']">
                {getKategoriLabel(kategori)}
              </span>
              <svg
                width="20"
                height="20"
                fill="none"
                className={`transition-transform duration-300 ease-in-out ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M7 8L10 11L13 8"
                  stroke="#64748B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              role="listbox"
              aria-hidden={
                !dropdownOpen ||
                isLoadingKategori ||
                kategoriOptions.length === 0
              }
              className={`absolute left-0 right-0 mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 flex flex-col overflow-hidden max-h-60 overflow-y-auto
                                         transition-all duration-300 ease-in-out transform
                                         ${
                                           dropdownOpen &&
                                           !isLoadingKategori &&
                                           kategoriOptions.length > 0
                                             ? "opacity-100 scale-100"
                                             : "opacity-0 scale-95 pointer-events-none"
                                         }`}
            >
              {!isLoadingKategori &&
                kategoriOptions.length > 0 &&
                kategoriOptions.map((categoryOption) => (
                  <div
                    key={categoryOption.reactKey}
                    role="option"
                    aria-selected={kategori === categoryOption.value}
                    className={`px-4 py-3 text-black text-base font-normal font-['Geist'] cursor-pointer hover:bg-gray-100 ${
                      kategori === categoryOption.value ? "bg-gray-100" : ""
                    } ${
                      categoryOption.value === "" ? "text-gray-500 italic" : ""
                    }`}
                    onClick={() => {
                      setKategori(categoryOption.value);
                      setDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setKategori(categoryOption.value);
                        setDropdownOpen(false);
                      }
                    }}
                    tabIndex={0}
                  >
                    {categoryOption.label}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </form>

      {notification.show && (
        <div
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
            notification.type === "success"
              ? "bg-[#199F48] text-white"
              : "bg-red-500 text-white"
          }`}
          style={{
            zIndex: 1000,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
