"use client";

import { getCategory } from "@/app/lib/api/category";
import { addProduct, updateProduct } from "@/app/lib/api/product";
import { ChevronDown, Image as LucideImage, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
// Impor ConfirmationDialog dari path yang benar
import ConfirmationDialog from '@/app/components/ConfirmationDialog'; // Atau '@/app/components/ConfirmationDialog'

// ... (fungsi formatRupiahForDisplay dan cleanRupiah tetap sama)
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
  onSaveSuccess,
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

  const [isSaving, setIsSaving] = useState(false);
  const [currentProductStatus, setCurrentProductStatus] = useState(null);

  // State untuk dialog konfirmasi
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] = useState({
    title: "",
    message: "",
    confirmText: "",
    cancelText: "Batal",
    onConfirm: () => {},
    isDestructive: false,
    productName: "",
  });

  // ... (useEffect untuk fetchKategoriList tetap sama)
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
        console.error("[Form] Gagal mengambil daftar kategori:", response?.error || response);
        setKategoriOptions([{ reactKey: "cat-error-placeholder", label: "Gagal memuat kategori", value: "" }]);
      }
      setIsLoadingKategori(false);
    };
    fetchKategoriList();
  }, []);

  // ... (useEffect untuk mengisi form saat edit/add tetap sama)
  useEffect(() => {
    console.log(`[Form] Mode: ${formMode}. Menerima productData:`, productData);
    if (formMode === "edit" && productData) {
      const editProductId = productData?.id;
      console.log(`[Form] useEffect (edit) - ID Produk dari props: '${editProductId}', Tipe: '${typeof editProductId}'`);
      if (editProductId === undefined || editProductId === null || String(editProductId).trim() === "" || String(editProductId).toLowerCase() === "undefined") {
        console.error("[Form] CRITICAL useEffect (edit): productData untuk edit memiliki ID tidak valid!", productData);
        alert("Data produk untuk diedit tidak valid (ID bermasalah). Form akan ditutup.");
        if (onClose) onClose();
        return;
      }
      setNamaProduk(productData.name || "");
      setDeskripsiProduk(productData.description || "");
      setHarga(productData.price ? String(productData.price) : "");
      setStok(productData.stock ? String(productData.stock) : "");
      setImageFile(null);
      setKategori(""); 
      setCurrentProductStatus(productData.status || "Onlisting"); 
    } else if (formMode === "add") {
      setNamaProduk(""); setDeskripsiProduk(""); setHarga(""); setStok(""); setImageFile(null); setKategori("");
      setCurrentProductStatus("Onlisting"); 
    }
  }, [productData, formMode, onClose]);

  // ... (useEffect untuk set kategori setelah load tetap sama)
  useEffect(() => {
    if (formMode === "edit" && productData && !isLoadingKategori && kategoriOptions.length > 0) {
      const initialCategoryValue = productData.category?.name || "";
      if (kategori === "") { 
        const categoryExists = kategoriOptions.some(opt => opt.value === initialCategoryValue);
        console.log(`[Form] useEffect (setKategori after load) - Initial: '${initialCategoryValue}', Exists: ${categoryExists}, Current Kategori: '${kategori}'`);
        if (categoryExists) setKategori(initialCategoryValue);
        else setKategori(""); 
      }
    }
  }, [formMode, productData, isLoadingKategori, kategoriOptions, kategori]);

  // ... (useEffect untuk handleClickOutside dropdown kategori tetap sama)
  useEffect(() => {
    function handleClickOutside(event) {
      if (kategoriDropdownRef.current && !kategoriDropdownRef.current.contains(event.target)) {
        setKategoriDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ... (handleImageChange dan getKategoriLabel tetap sama)
   const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar maks 5MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setImageFile(null); return;
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        alert("Format file: JPG, PNG, JPEG.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setImageFile(null); return;
      }
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  }, []);

  const getKategoriLabel = useCallback((selectedValue) => {
    if (isLoadingKategori && (!kategoriOptions.length || (kategoriOptions.length === 1 && kategoriOptions[0].value === ""))) return "Memuat kategori...";
    const foundOption = kategoriOptions.find(option => option.value === selectedValue);
    return foundOption ? foundOption.label : "Pilih Kategori...";
  }, [isLoadingKategori, kategoriOptions]);

  // ... (handleSubmit tetap sama)
  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    console.log("[Form] handleSubmit dipanggil.");

    if (!namaProduk.trim() || !deskripsiProduk.trim()) { alert("Nama produk dan deskripsi harus diisi."); return; }
    if (!kategori && !(kategoriOptions.length === 1 && kategoriOptions[0].value === "")) { alert("Kategori harus dipilih."); return; }
    
    const finalHarga = parseInt(cleanRupiah(harga), 10);
    const finalStok = parseInt(stok, 10);

    if (isNaN(finalHarga) || finalHarga <= 0) { alert("Harga tidak valid (harus > 0)."); return; }
    if (isNaN(finalStok) || finalStok < 0) { alert("Stok tidak valid (boleh 0)."); return; }
    
    if (formMode === "add" && !imageFile) {
        console.warn("[Form] Tidak ada gambar dipilih untuk produk baru. Backend Anda mungkin memerlukan image_url.");
    }

    setIsSaving(true);

    let payload = {
      name: namaProduk,
      description: deskripsiProduk,
      price: finalHarga,
      stock: finalStok,
      category: kategori,
      image_url: null,
      status: formMode === "edit" ? currentProductStatus : "Onlisting", 
    };

    if (imageFile) {
      payload.image_url = `local:${imageFile.name}`; 
      console.warn(`[Form] Mengirim nama file '${imageFile.name}' sebagai image_url karena API berbasis JSON. Seharusnya Anda menggunakan FormData untuk upload file.`);
    } else if (formMode === "edit" && productData?.image_url) {
      if (typeof productData.image_url === 'string') {
        payload.image_url = productData.image_url;
      }
    }

    let response;
    let successMessage = "";

    if (formMode === "edit") {
      const editId = productData?.id;
      console.log(`[Form] handleSubmit (edit) - ID Produk yang akan digunakan: '${editId}', Tipe: '${typeof editId}'`);
      if (editId === undefined || editId === null || String(editId).trim() === "" || String(editId).toLowerCase() === "undefined") {
        console.error("[Form] handleSubmit CRITICAL (edit): ID produk tidak valid sebelum memanggil API!", editId);
        alert("Error Internal: ID produk tidak valid untuk pembaruan. Operasi dibatalkan.");
        setIsSaving(false); return;
      }
      payload.id = editId;
      
      console.log("[Form] Memanggil updateProduct (JSON) dengan payload:", payload);
      response = await updateProduct(payload);
      successMessage = "Produk berhasil diperbarui!";

    } else if (formMode === "add") {
      if (authUser && authUser.id) {
        payload.user_id = authUser.id;
      } else {
        alert("Tidak dapat menambahkan produk, informasi pengguna tidak ditemukan.");
        console.error("[Form] Auth user ID is missing for adding new product.");
        setIsSaving(false); return;
      }
      console.log("[Form] Memanggil addProduct (JSON) dengan payload:", payload);
      response = await addProduct(payload);
      successMessage = "Produk berhasil ditambahkan!";
    }

    setIsSaving(false);
    console.log("[Form] Respons dari API client (addProduct/updateProduct):", response);

    if (response && response.error === false) {
      window.alert(response.message || successMessage);
      if (onSaveSuccess) onSaveSuccess();
    } else {
      let detailErrorMessage = "Gagal menyimpan produk."; 
      if (response && (response.message || typeof response.error === 'string')) {
        detailErrorMessage = response.message || response.error; 
      } else if (response && response.status) {
         detailErrorMessage = `Terjadi kesalahan server (Status: ${response.status})`;
      } else if (!response) {
         detailErrorMessage = "Gagal menghubungi server atau respons tidak diterima.";
      }
      console.error("[Form] Gagal menyimpan produk (kondisi else tercapai):", response);
      window.alert(detailErrorMessage);
    }
  }, [
      namaProduk, deskripsiProduk, harga, stok, kategori, imageFile, 
      formMode, productData, authUser, 
      kategoriOptions, 
      onSaveSuccess,
      currentProductStatus 
    ]);

  // Modifikasi handleStatusChange
  const handleStatusChange = useCallback((newStatus) => {
    if (formMode !== "edit" || !productData || !productData.id) {
      alert("Operasi tidak valid."); // Seharusnya tidak terjadi jika tombol hanya muncul di mode edit
      return;
    }
    

    if (newStatus === "Inactive") {
      setConfirmDialogProps({
        title: "Konfirmasi Suspend Produk",
        message: "Apakah anda yakin untuk suspend produk ini?", // productName akan disisipkan oleh ConfirmationDialog
        confirmText: "Suspend",
        cancelText: "Batal",
        onConfirm: () => proceedWithStatusChange(newStatus),
        isDestructive: true,
      });
    } else { // newStatus === "Onlisting"
      setConfirmDialogProps({
        title: "Konfirmasi Pengaktifan Produk",
        message: "Apakah anda yakin untuk mengaktifkan kembali produk ini?", // productName akan disisipkan
        confirmText: "Approve", // Sesuai template "Active" Anda
        cancelText: "Cancel", // Sesuai template "Active" Anda
        onConfirm: () => proceedWithStatusChange(newStatus),
        isDestructive: false,
        // Anda bisa menambahkan props warna di sini jika ingin override default di ConfirmationDialog
        // activateConfirmBgColor: "bg-custom-green", 
        // activateConfirmTextColor: "text-custom-dark-green",
      });
    }
    setIsConfirmDialogOpen(true);
  }, [formMode, productData, kategori, onSaveSuccess]); // Tambahkan onSaveSuccess jika digunakan di proceedWithStatusChange

  // Fungsi untuk melanjutkan aksi setelah konfirmasi
  const proceedWithStatusChange = async (newStatus) => {
    setIsConfirmDialogOpen(false); // Tutup dialog
    if (!productData || !productData.id) return; // Guard clause

    setIsSaving(true);

    const payload = {
      id: productData.id,
      name: productData.name, // Kirim data yang ada
      description: productData.description,
      price: parseInt(cleanRupiah(String(productData.price)), 10),
      stock: parseInt(String(productData.stock), 10),
      category: productData.category?.name || kategori, // Gunakan kategori dari productData atau state
      image_url: productData.image_url || null,
      status: newStatus, // Status baru
    };
    
    console.log("[Form] Memanggil updateProduct untuk perubahan status dengan payload:", payload);
    const response = await updateProduct(payload);
    setIsSaving(false);

    if (response && response.error === false) {
      setCurrentProductStatus(newStatus); // Update status lokal
      window.alert(response.message || `Status produk berhasil diubah menjadi ${newStatus}.`);
      if (onSaveSuccess) onSaveSuccess(); // Refresh daftar produk di halaman utama
    } else {
      let detailErrorMessage = `Gagal mengubah status produk.`;
      if (response && (response.message || typeof response.error === 'string')) {
        detailErrorMessage = response.message || response.error;
      } else if (response && response.status) {
        detailErrorMessage = `Terjadi kesalahan server (Status: ${response.status})`;
      }
      console.error("[Form] Gagal mengubah status produk:", response);
      window.alert(detailErrorMessage);
    }
  };

  const isEditMode = formMode === "edit";
  const formTitle = isEditMode ? "Edit Produk" : "Tambah Produk";
  const formDescription = isEditMode
    ? `Perbarui informasi untuk produk "${productData?.name || "ini"}"`
    : "Isi detail untuk produk baru Anda";
  const submitButtonText = isEditMode ? "Save" : "Tambah Produk";

  // ... (logika fileInputButtonText tetap sama)
  let fileInputButtonText = "Klik untuk upload gambar";
  let FileInputIcon = <Upload size={20} className="text-[#A3A3A3] flex-shrink-0" />;
  let fileInputTextColor = "text-[#A3A3A3]";

  if (imageFile) {
    fileInputButtonText = imageFile.name.substring(0, 25) + (imageFile.name.length > 25 ? "..." : "");
    FileInputIcon = <LucideImage size={20} className="text-neutral-700 flex-shrink-0" />;
    fileInputTextColor = "text-neutral-900";
  } else if (isEditMode && productData?.image_url && typeof productData.image_url === 'string') {
    try {
      if (productData.image_url.startsWith("local:")) {
         fileInputButtonText = `Ganti: ${productData.image_url.replace("local:", "").substring(0,25)}...`;
      } else {
         const urlParts = productData.image_url.split("/");
         const fileNameFromUrl = decodeURIComponent(urlParts[urlParts.length - 1]);
         fileInputButtonText = `Ganti: ${fileNameFromUrl.substring(0, 25)}${fileNameFromUrl.length > 25 ? '...' : ''}`;
      }
    } catch (e) { fileInputButtonText = "Ganti gambar..."; }
    FileInputIcon = <LucideImage size={20} className="text-neutral-700 flex-shrink-0" />;
    fileInputTextColor = "text-neutral-700";
  }


  return (
    // Gunakan React Fragment jika ada lebih dari satu elemen root
    <> 
      <div className="flex-1 p-5 bg-white rounded-xl flex flex-col justify-start items-start gap-6 overflow-auto mt-4 md:mt-0">
        {/* ... Breadcrumbs ... */}
        <div className="self-stretch inline-flex justify-start items-center gap-2">
            <button type="button" className="text-[#969696] hover:text-gray-700 cursor-pointer" onClick={onClose}>Produk Saya</button>
            <span className="w-5 h-5 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 5L12 10L7 15" stroke="#969696" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <div className="text-[#171717] font-medium">{formTitle}</div>
        </div>
        
        {/* ... Judul Form dan Tombol Aksi Utama ... */}
        <div className="self-stretch flex flex-col sm:flex-row justify-between sm:items-end gap-2">
            <div>
            <div className="text-black text-2xl font-medium">{formTitle}</div>
            <p className="text-neutral-500">{formDescription}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
            {/* --- Tombol Suspend/Active --- */}
            {isEditMode && productData && (
                <>
                {currentProductStatus === "Onlisting" && (
                    <button
                    type="button"
                    onClick={() => handleStatusChange("Inactive")} // Panggil dengan status baru
                    className="px-4 py-2 bg-white text-[#ef4444] border border-gray-200 rounded-lg hover:bg-gray-50 min-w-[120px] cursor-pointer font-medium shadow-sm"
                    disabled={isSaving}
                    >
                    {isSaving ? "Memproses..." : "Suspend"}
                    </button>
                )}
                {currentProductStatus === "Inactive" && (
                    <button
                    type="button"
                    onClick={() => handleStatusChange("Onlisting")} // Panggil dengan status baru
                    className="px-4 py-2 bg-white text-[#008a2e] border border-gray-200 rounded-lg hover:bg-gray-50 min-w-[120px] cursor-pointer font-medium shadow-sm"
                    disabled={isSaving}
                    >
                    {isSaving ? "Memproses..." : "Active"}
                    </button>
                )}
                </>
            )}
            {/* --- Tombol Simpan/Tambah Produk --- */}
            <button type="submit" form="product-form"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 min-w-[120px] cursor-pointer"
                disabled={(isLoadingKategori && (!kategoriOptions.length || kategoriOptions[0]?.value === "")) || isSaving}
            >
                {isSaving ? "Menyimpan..." : ((isLoadingKategori && (!kategoriOptions.length || kategoriOptions[0]?.value === "")) ? "Memuat..." : submitButtonText)}
            </button>
            </div>
        </div>

        {/* ... Form Fields ... */}
        <form onSubmit={handleSubmit} id="product-form" className="w-full flex flex-col gap-6 md:w-3/4 lg:w-2/3">
            <div className="w-full flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="namaProduk" className="text-neutral-700 font-medium">Nama Produk</label>
                <div className="h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl border border-gray-300">
                <input id="namaProduk" type="text" className="bg-transparent outline-none w-full placeholder-gray-400"
                    value={namaProduk} onChange={(e) => setNamaProduk(e.target.value)} placeholder="Ex: Alang-alang Hitam" required maxLength={100} />
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="deskripsiProduk" className="text-neutral-700 font-medium">Deskripsi</label>
                <div className="h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl border border-gray-300">
                <input id="deskripsiProduk" type="text" className="bg-transparent outline-none w-full placeholder-gray-400"
                    value={deskripsiProduk} onChange={(e) => setDeskripsiProduk(e.target.value)} placeholder="Ex: Asli Majalengka..." required maxLength={255} />
                </div>
            </div>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="harga" className="text-neutral-700 font-medium">Harga</label>
                <div className="h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex items-center border border-gray-300">
                <span className="mr-2">Rp</span>
                <input id="harga" type="text" inputMode="numeric" className="bg-transparent outline-none w-full placeholder-gray-400"
                    value={formatRupiahForDisplay(harga)} onChange={e => setHarga(cleanRupiah(e.target.value))} placeholder="0" required />
                </div>
            </div>
            <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="stok" className="text-neutral-700 font-medium">Stok</label>
                <div className="h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl border border-gray-300">
                <input id="stok" type="text" inputMode="numeric" className="bg-transparent outline-none w-full placeholder-gray-400"
                    value={stok} onChange={e => setStok(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" required />
                </div>
            </div>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-6">
            <div className="w-full flex flex-col gap-2"> {/* Kategori mengambil lebar penuh di mobile, row di md */}
                <label htmlFor="kategori-input" className="text-neutral-700 font-medium">Kategori</label>
                <div className="relative self-stretch" ref={kategoriDropdownRef}>
                <button id="kategori-input" type="button"
                    className="w-full h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl flex justify-between items-center text-left border border-gray-300 cursor-pointer"
                    onClick={() => !isLoadingKategori && kategoriOptions.length > 0 && !(kategoriOptions.length === 1 && kategoriOptions[0].value === "") && setKategoriDropdownOpen(p => !p)}
                    aria-haspopup="listbox" aria-expanded={kategoriDropdownOpen}
                    disabled={isLoadingKategori || !kategoriOptions.length || (kategoriOptions.length === 1 && kategoriOptions[0].value === "")}
                >
                    <span className="truncate pr-2">{getKategoriLabel(kategori)}</span>
                    <ChevronDown size={20} className={`text-gray-600 shrink-0 transition-transform ${kategoriDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {kategoriDropdownOpen && !isLoadingKategori && kategoriOptions.length > 0 && !(kategoriOptions.length === 1 && kategoriOptions[0].value === "") && (
                        <div role="listbox" className="absolute w-full mt-1 z-20 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                            {kategoriOptions.filter(opt => opt.value !== "").map(opt => (
                                <div key={opt.reactKey} role="option" aria-selected={kategori === opt.value}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-100 ${kategori === opt.value ? "bg-gray-100" : ""}`}
                                onClick={() => { setKategori(opt.value); setKategoriDropdownOpen(false); }}
                                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { setKategori(opt.value); setKategoriDropdownOpen(false); }}}
                                tabIndex={0}
                                >{opt.label}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full flex flex-col gap-2"> {/* Upload gambar mengambil lebar penuh di mobile, row di md */}
                <label htmlFor="imageUploadButtonTrigger" className="text-neutral-700 font-medium">
                Gambar Produk{" "}
                {isEditMode && productData?.image_url && !imageFile && (
                    <span className="text-xs text-gray-500">(Biarkan kosong jika tidak ingin mengubah)</span>
                )}
                </label>
                <button type="button" id="imageUploadButtonTrigger"
                className="w-full h-[48px] bg-gray-100 rounded-xl flex items-center gap-2 border border-gray-300 hover:border-gray-400 px-4 py-3 text-left cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                >
                <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleImageChange} className="hidden" ref={fileInputRef} />
                {FileInputIcon}
                <div className={`truncate ${fileInputTextColor}`}>{fileInputButtonText}</div>
                </button>
                <p className="text-end text-xs text-gray-500 mt-1">JPG, PNG, JPEG (Max 5MB)</p>
            </div>
            </div>
        </form>
      </div>

      {/* Render ConfirmationDialog di sini */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        title={confirmDialogProps.title}
        message={confirmDialogProps.message}
        confirmText={confirmDialogProps.confirmText}
        cancelText={confirmDialogProps.cancelText}
        onConfirm={confirmDialogProps.onConfirm}
        onCancel={() => setIsConfirmDialogOpen(false)} // Selalu tutup dialog saat batal
        isDestructive={confirmDialogProps.isDestructive}
        productName={confirmDialogProps.productName}
        // Anda dapat meneruskan warna spesifik untuk tombol "Activate" jika diperlukan
        // activateConfirmBgColor={confirmDialogProps.activateConfirmBgColor} 
        // activateConfirmTextColor={confirmDialogProps.activateConfirmTextColor}
      />
    </>
  );
}