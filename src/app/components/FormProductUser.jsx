"use client";

import { getCategory } from "@/app/lib/api/category";
import { ChevronDown, Image as LucideImage, Upload } from "lucide-react";
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

export default function FormProductUser({
  productData,
  onClose,
  onSave,
  formMode,
  authUser,
}) {
  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsiProduk, setDeskripsiProduk] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [kategori, setKategori] = useState("");
  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [isLoadingKategori, setIsLoadingKategori] = useState(true);
  const [kategoriDropdownOpen, setKategoriDropdownOpen] = useState(false);
  const kategoriDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

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
        const formattedOptions = response.data.map((cat, index) => ({
          reactKey: `cat-${cat.id || `idx-${index}`}`,
          label: cat.name || `Kategori Tanpa Nama ${index + 1}`,
          value: cat.name || "",
        }));
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

  useEffect(() => {
    console.log(`[Form] Mode: ${formMode}, Menerima productData:`, productData);
    if (formMode === "edit" && productData) {
      if (productData.id === undefined || productData.id === null) {
        console.error(
          "CRITICAL [Form]: productData untuk edit tidak memiliki ID!",
          productData
        );
      }
      console.log(
        `[Form] Edit mode - ID Produk dari props: ${
          productData.id
        } (tipe: ${typeof productData.id})`
      );
      setNamaProduk(productData.name || "");
      setDeskripsiProduk(productData.description || "");
      setHarga(productData.price ? String(productData.price) : "");
      setStok(productData.stock ? String(productData.stock) : "");
      setImageFile(null);

      const initialCategoryValue = productData.category?.name || "";
      if (!isLoadingKategori && kategoriOptions.length > 0) {
        const categoryExists = kategoriOptions.some(
          (opt) => opt.value === initialCategoryValue
        );
        setKategori(categoryExists ? initialCategoryValue : "");
      } else if (isLoadingKategori) {
        setKategori("");
      }
    } else if (formMode === "add") {
      setNamaProduk("");
      setDeskripsiProduk("");
      setHarga("");
      setStok("");
      setImageFile(null);
      setKategori("");
    }
  }, [productData, formMode, isLoadingKategori, kategoriOptions]);

  useEffect(() => {
    if (
      formMode === "edit" &&
      productData &&
      !isLoadingKategori &&
      kategoriOptions.length > 0
    ) {
      const currentInitialCategoryValue = productData.category?.name || "";

      if (kategori !== currentInitialCategoryValue) {
        const categoryExists = kategoriOptions.some(
          (opt) => opt.value === currentInitialCategoryValue
        );
        if (categoryExists) {
          setKategori(currentInitialCategoryValue);
        } else if (
          kategori === "" &&
          kategoriOptions.length > 0 &&
          kategoriOptions[0].value !== ""
        ) {
        } else if (kategori === "" && !categoryExists) {
          setKategori("");
        }
      }
    }
  }, [productData, formMode, isLoadingKategori, kategoriOptions, kategori]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        kategoriDropdownRef.current &&
        !kategoriDropdownRef.current.contains(event.target)
      ) {
        setKategoriDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(
          "Ukuran gambar melebihi 5MB. Silakan pilih file yang lebih kecil."
        );
        if (fileInputRef.current) fileInputRef.current.value = "";
        setImageFile(null);
        return;
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Format file tidak didukung. Harap unggah JPG, PNG, atau JPEG.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setImageFile(null);
        return;
      }
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  function getKategoriLabel(selectedValue) {
    if (isLoadingKategori && kategoriOptions.length === 0)
      return "Memuat kategori...";
    const foundOption = kategoriOptions.find(
      (option) => option.value === selectedValue
    );
    return foundOption ? foundOption.label : "Pilih Kategori...";
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("[Form] handleSubmit dipanggil.");

    if (!namaProduk.trim() || !deskripsiProduk.trim()) {
      alert("Nama produk dan deskripsi harus diisi.");
      return;
    }
    if (
      !kategori &&
      !(kategoriOptions.length === 1 && kategoriOptions[0].value === "")
    ) {
      alert("Kategori harus dipilih.");
      return;
    }

    const finalHarga = parseInt(cleanRupiah(harga), 10);
    const finalStok = parseInt(stok, 10);

    if (isNaN(finalHarga) || finalHarga <= 0) {
      alert("Harga tidak valid. Masukkan angka positif lebih dari 0.");
      return;
    }
    if (isNaN(finalStok) || finalStok < 0) {
      alert("Stok tidak valid. Masukkan angka positif.");
      return;
    }
    if (formMode === "add" && !imageFile) {
      alert("Gambar produk harus diunggah untuk produk baru.");
      return;
    }

    let payload = {
      name: namaProduk,
      description: deskripsiProduk,
      price: finalHarga,
      stock: finalStok,
      category: kategori,
    };

    if (formMode === "edit") {
      if (
        productData &&
        productData.id !== undefined &&
        productData.id !== null
      ) {
        payload.id = productData.id;
        console.log(
          `[Form] Mode Edit - Menyertakan ID ke payload: ${payload.id}`
        );
      } else {
        console.error(
          "CRITICAL [Form] handleSubmit: ID produk tidak ada di productData saat mode edit!"
        );
        alert(
          "Error: ID produk tidak ditemukan untuk pembaruan. Operasi dibatalkan."
        );
        return;
      }
      if (imageFile) {
        payload.image_url = imageFile;
      }
    } else if (formMode === "add") {
      payload.image_url = imageFile;
      if (authUser && authUser.id) {
        payload.user_id = authUser.id;
      } else {
        alert(
          "Tidak dapat menambahkan produk, informasi pengguna tidak ditemukan."
        );
        console.error("Auth user ID is missing for adding new product.");
        return;
      }
    }
    console.log("[Form] Mengirim payload ke onSave:", payload);
    onSave(payload);
  };

  const isEditMode = formMode === "edit";
  const formTitle = isEditMode ? "Edit Produk" : "Tambah Produk";
  const formDescription = isEditMode
    ? `Perbarui informasi untuk produk "${productData?.name || "ini"}"`
    : "Isi detail untuk produk baru Anda";
  const submitButtonText = isEditMode ? "Simpan Perubahan" : "Tambah Produk";

  let fileInputButtonText = "Klik untuk upload gambar";
  let FileInputIcon = (
    <Upload size={20} className="text-[#A3A3A3] flex-shrink-0" />
  );
  let fileInputTextColor = "text-[#A3A3A3]";

  if (imageFile) {
    fileInputButtonText = imageFile.name;
    FileInputIcon = (
      <LucideImage size={20} className="text-neutral-700 flex-shrink-0" />
    );
    fileInputTextColor = "text-neutral-900";
  } else if (isEditMode && productData?.image_url) {
    try {
      const urlParts = productData.image_url.split("/");
      const fileNameFromUrl = decodeURIComponent(urlParts[urlParts.length - 1]);
      fileInputButtonText = `Ganti: ${fileNameFromUrl}`;
    } catch (e) {
      fileInputButtonText = "Ganti gambar...";
    }
    FileInputIcon = (
      <LucideImage size={20} className="text-neutral-700 flex-shrink-0" />
    );
    fileInputTextColor = "text-neutral-700";
  }

  return (
    <div className="flex-1 p-5 bg-white rounded-xl flex flex-col justify-start items-start gap-6 overflow-auto mt-4 md:mt-0">
      {/* Breadcrumb */}
      <div className="self-stretch inline-flex justify-start items-center gap-2">
        <button
          type="button"
          className="text-[#969696] text-base font-normal font-['Geist'] leading-tight hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          Produk Saya
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

      {/* Form Header */}
      <div className="self-stretch inline-flex flex-col sm:flex-row justify-between sm:items-end gap-2">
        <div className="inline-flex flex-col justify-start items-start gap-2">
          <div className="text-black text-2xl font-medium font-['Geist']">
            {formTitle}
          </div>
          <p className="text-neutral-500 text-base font-medium font-['Geist']">
            {formDescription}
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0 self-start sm:self-center">
          <button
            type="submit"
            form="product-form"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            disabled={isLoadingKategori && kategoriOptions.length === 0}
          >
            {isLoadingKategori && kategoriOptions.length === 0
              ? "Memuat..."
              : submitButtonText}
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <form
        onSubmit={handleSubmit}
        id="product-form"
        className="w-full flex flex-col gap-6 md:w-3/4 lg:w-2/3"
      >
        {/* Baris 1: Nama Produk & Deskripsi */}
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <label
              htmlFor="namaProduk"
              className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
            >
              Nama Produk
            </label>
            <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300">
              <input
                id="namaProduk"
                type="text"
                className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
                value={namaProduk}
                onChange={(e) => setNamaProduk(e.target.value)}
                placeholder="Ex: Alang-alang Hitam"
                required
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label
              htmlFor="deskripsiProduk"
              className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
            >
              Deskripsi
            </label>
            <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300">
              <input
                id="deskripsiProduk"
                type="text"
                className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
                value={deskripsiProduk}
                onChange={(e) => setDeskripsiProduk(e.target.value)}
                placeholder="Ex: Asli Majalengka"
                required
              />
            </div>
          </div>
        </div>

        {/* Baris Baru untuk Kategori */}
        <div className="w-full flex flex-col gap-2">
          <label
            htmlFor="kategori-input"
            className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
          >
            Kategori
          </label>
          <div className="relative self-stretch" ref={kategoriDropdownRef}>
            <button
              id="kategori-input"
              type="button"
              className="w-full h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex justify-between items-center text-left border border-gray-300 cursor-pointer"
              onClick={() =>
                !isLoadingKategori &&
                kategoriOptions.length > 0 &&
                !(
                  kategoriOptions.length === 1 &&
                  kategoriOptions[0].value === ""
                ) &&
                setKategoriDropdownOpen((prev) => !prev)
              }
              aria-haspopup="listbox"
              aria-expanded={kategoriDropdownOpen}
              disabled={
                isLoadingKategori ||
                kategoriOptions.length === 0 ||
                (kategoriOptions.length === 1 &&
                  kategoriOptions[0].value === "")
              }
            >
              <span className="text-neutral-900 text-base font-medium font-['Geist']">
                {getKategoriLabel(kategori)}
              </span>
              <ChevronDown
                size={20}
                className={`text-gray-600 transition-transform duration-300 ${
                  kategoriDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {kategoriDropdownOpen &&
              !isLoadingKategori &&
              kategoriOptions.length > 0 &&
              !(
                kategoriOptions.length === 1 && kategoriOptions[0].value === ""
              ) && (
                <div
                  role="listbox"
                  aria-hidden={!kategoriDropdownOpen}
                  className={`absolute left-0 right-0 mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 flex flex-col overflow-hidden max-h-60 overflow-y-auto transition-all duration-300 ease-in-out transform ${
                    kategoriDropdownOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  {kategoriOptions
                    .filter((option) => option.value !== "")
                    .map((categoryOption) => (
                      <div
                        key={categoryOption.reactKey}
                        role="option"
                        aria-selected={kategori === categoryOption.value}
                        className={`px-4 py-3 text-black text-base font-normal font-['Geist'] cursor-pointer hover:bg-gray-100 ${
                          kategori === categoryOption.value ? "bg-gray-100" : ""
                        }`}
                        onClick={() => {
                          setKategori(categoryOption.value);
                          setKategoriDropdownOpen(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setKategori(categoryOption.value);
                            setKategoriDropdownOpen(false);
                          }
                        }}
                        tabIndex={0}
                      >
                        {categoryOption.label}
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>

        {/* Baris Harga & Stok */}
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <label
              htmlFor="harga"
              className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
            >
              Harga
            </label>
            <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300">
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
            <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300">
              <input
                id="stok"
                type="text"
                inputMode="numeric"
                className="bg-transparent outline-none border-none w-full text-neutral-900 text-base font-medium font-['Geist'] placeholder-gray-400"
                value={stok}
                onChange={(e) => setStok(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Baris Gambar */}
        <div className="w-full flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col gap-2">
            <label
              htmlFor="imageUploadButtonTrigger"
              className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal"
            >
              Gambar Produk{" "}
              {isEditMode && productData?.image_url && !imageFile && (
                <span className="text-xs text-gray-500">
                  (Tidak diubah jika kosong)
                </span>
              )}
            </label>
            <button
              type="button"
              id="imageUploadButtonTrigger"
              className="w-full h-[48px] bg-gray-100 rounded-xl flex flex-row justify-start items-center gap-2 border border-gray-300 hover:border-gray-400 transition-colors cursor-pointer px-4 py-3 text-left"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleImageChange}
                className="hidden"
                ref={fileInputRef}
                aria-labelledby="imageUploadButtonTrigger"
              />
              {FileInputIcon}
              <div className={`text-base truncate ${fileInputTextColor}`}>
                {fileInputButtonText}
              </div>
            </button>
            <p className="text-end text-xs text-gray-500 mt-1">
              JPG, PNG, JPEG (Max 5MB)
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
