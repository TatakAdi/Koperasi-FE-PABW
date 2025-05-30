'use client';

import Kategori from "@/app/components/Kategori";
import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { useEffect, useState } from "react";

export default function ProductPage() {
  const [keyword, setKeyword] = useInput();
  const [authUser, setAuthUser] = useState(null);

  // State untuk mode edit dan data produk yang diedit
  const [editIndex, setEditIndex] = useState(null);

  // State untuk form edit
  const [editHarga, setEditHarga] = useState("");
  const [editStok, setEditStok] = useState("");
  const [editKategori, setEditKategori] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Data produk dummy
  const products = [
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "berat",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "minuman",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
    {
      gambar: "https://placehold.co/64x64",
      nama: "Holland Bakery cabang “Grobogan”",
      kategori: "ringan",
      harga: "Rp. 20.000",
      stok: 12,
      penjual: "Mas Fu’ad Grobogan",
    },
  ];

  // Kategori list
  const kategoriList = [
    { label: "Makanan Berat", value: "berat" },
    { label: "Makanan Ringan", value: "ringan" },
    { label: "Minuman", value: "minuman" },
  ];

  // Untuk menampilkan label kategori dari value
  const getKategoriLabel = (val) => {
    const found = kategoriList.find((k) => k.value === val);
    return found ? k.label : "";
  };

  // Inisialisasi state edit jika index berubah
  useEffect(() => {
    if (editIndex !== null) {
      setEditHarga(products[editIndex].harga.replace(/[^\d.,]/g, ""));
      setEditStok(products[editIndex].stok.toString());
      setEditKategori(products[editIndex].kategori);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editIndex]);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  // Fungsi untuk memformat angka ke dalam format Rupiah
  function formatRupiah(angka) {
    if (!angka) return "";
    // Hilangkan semua karakter non-digit
    const numberString = angka.replace(/[^0-9]/g, "");
    // Format ribuan
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Jika sedang edit, tampilkan tampilan edit sesuai desain
  if (editIndex !== null) {
    const product = products[editIndex];

    return (
      <div className="w-full h-[1024px] relative bg-white overflow-hidden">
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
        <div className="w-full h-full flex flex-row">
          <SidebarAdmin />
          <div className="w-[1124px] h-[936px] px-5 py-4 bg-white rounded-xl inline-flex flex-col justify-start items-start gap-6 overflow-hidden mt-4">
            {/* Breadcrumb */}
            <div className="self-stretch inline-flex justify-start items-center gap-2">
              <div className="flex justify-center items-center gap-2">
                <div className="text-SIDE-ICON text-base font-normal font-['Geist'] leading-tight">
                  Data Produk
                </div>
                {/* Arrow kanan */}
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M8 6L12 10L8 14" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="text-17-SOFT-BLACK text-base font-medium font-['Geist'] leading-tight">
                  Edit Produk
                </div>
              </div>
            </div>
            {/* Title & Save */}
            <div className="self-stretch min-w-[1084px] inline-flex justify-between items-end">
              <div className="inline-flex flex-col justify-start items-start gap-2">
                <div className="text-black text-2xl font-medium font-['Geist']">
                  Edit Product
                </div>
                <div className="text-neutral-500 text-base font-medium font-['Geist']">
                  Ubah informasi terkait produk
                </div>
              </div>
              <button
                className="px-4 py-2 bg-black rounded-lg flex justify-center items-center gap-1 overflow-hidden"
                onClick={() => setEditIndex(null)}
                type="button"
              >
                <div className="px-2 flex justify-center items-center">
                  <div className="text-white text-base font-medium font-['Geist'] leading-normal">
                    Save
                  </div>
                </div>
              </button>
            </div>
            {/* Form Edit */}
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="inline-flex justify-start items-start gap-6">
                {/* Input Harga */}
                <div className="w-96 max-w-96 inline-flex flex-col justify-start items-start gap-2">
                  <div className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">
                    Harga
                  </div>
                  <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl inline-flex justify-start items-center overflow-hidden">
                    <span className="text-neutral-900 text-base font-medium font-['Geist'] leading-normal mr-2">Rp.</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="bg-transparent border-none outline-none w-full text-neutral-900 text-base font-medium font-['Geist'] leading-normal"
                      value={formatRupiah(editHarga)}
                      onChange={e => setEditHarga(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="Masukkan harga"
                    />
                  </div>
                </div>
                {/* Input Stok */}
                <div className="w-96 max-w-96 inline-flex flex-col justify-start items-start gap-2">
                  <div className="text-neutral-700 text-base font-medium font-['Geist'] leading-normal">
                    Stok
                  </div>
                  <div className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl inline-flex justify-start items-center overflow-hidden">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="bg-transparent border-none outline-none w-full text-neutral-900 text-base font-medium font-['Geist'] leading-normal"
                      value={editStok}
                      onChange={e => setEditStok(e.target.value)}
                      placeholder="Masukkan stok"
                    />
                  </div>
                </div>
              </div>
              {/* Dropdown Kategori */}
              <div className="w-full max-w-[864px] inline-flex justify-start items-start gap-6">
                <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
                  <div className="justify-start text-neutral-700 text-base font-medium font-['Geist'] leading-normal">
                    Kategori
                  </div>
                  {/* Dropdown trigger */}
                  <div
                    className="self-stretch h-12 pl-4 pr-3 py-3 bg-gray-100 rounded-xl inline-flex justify-between items-center cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="text-black text-base font-normal font-['Inter'] leading-normal select-none">
                      {kategoriList.find((k) => k.value === editKategori)?.label || "Pilih Kategori"}
                    </div>
                    {/* Icon arrow bawah */}
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                      <path d="M6 8L10 12L14 8" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Dropdown list */}
                  {dropdownOpen && (
                    <div className="self-stretch bg-PRIMARY-2 rounded-md shadow-[-8px_0px_24px_16px_rgba(0,0,0,0.04)] shadow-[0px_8px_16px_-0.5px_rgba(0,0,0,0.02)] shadow-[0px_0px_0px_1px_rgba(224,224,224,1.00)] shadow-[0px_12px_24px_-1.5px_rgba(0,0,0,0.04)] shadow-[0px_16px_32px_-3px_rgba(0,0,0,0.04)] flex flex-col justify-start items-start mt-2 z-10">
                      {kategoriList.map((k) => (
                        <button
                          key={k.value}
                          type="button"
                          className={`self-stretch h-12 pl-4 pr-3 py-3 text-left inline-flex items-center text-black text-base font-normal font-['Inter'] leading-normal transition-colors
                            ${editKategori === k.value ? "bg-slate-100 rounded-md" : "bg-white"}
                            hover:bg-[#F1F5F9]`}
                          onClick={() => {
                            setEditKategori(k.value);
                            setDropdownOpen(false);
                          }}
                        >
                          {k.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[1024px] relative bg-white overflow-hidden">
      {/* Navbar */}
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
      <div className="w-full h-full flex flex-row">
        {/* Sidebar */}
        <SidebarAdmin />
        {/* Main Content */}
        <div className="w-full h-full px-5 py-4 mr-[32px] top-[88px] bg-white rounded-xl flex flex-col gap-12 overflow-hidden">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-black text-2xl font-medium font-[Geist]">Data Barang</div>
              <div className="text-neutral-500 text-base font-medium font-[Geist]">Lihat rincian dari produk yang tersedia</div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col">
                {/* Table Header */}
                <div className="w-full border-b border-neutral-200 flex flex-col gap-2.5">
                  <div className="flex items-center">
                    <div className="w-full h-14 border-r max-w-[10%] border-neutral-200 flex justify-center items-center gap-2">
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Gambar</div>
                    </div>
                    <div className="w-full h-14 border-r border-neutral-200 flex justify-center items-center gap-2">
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Nama Barang</div>
                    </div>
                    <div className="w-full h-14 border-r max-w-[15%] border-neutral-200 flex justify-center items-center gap-2">
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Kategori</div>
                    </div>
                    <div className="w-full h-14 border-r max-w-[10%] border-neutral-200 flex justify-center items-center gap-2">
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Harga</div>
                    </div>
                    <div className="w-full h-14 border-r max-w-[10%] border-neutral-200 flex justify-center items-center gap-2">
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Stok</div>
                    </div>
                    <div className="w-full h-14 border-r max-w-[15%] border-neutral-200 flex justify-center items-center gap-2">
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Penjual</div>
                    </div>
                    <div className="w-full h-14 border-r max-w-[10%] border-neutral-200 flex justify-center items-center gap-2">
                      <div className="text-[#737373] text-base font-medium font-[Geist] leading-normal">Aksi</div>
                    </div>
                  </div>
                </div>
                {/* Table Rows */}
                <div className="w-full flex flex-col">
                  {products.map((item, idx) => (
                    <div key={idx} className="border-b border-neutral-200 flex items-center">
                      <div className="w-full self-stretch max-w-[10%] p-2 border-r border-neutral-200 flex justify-center items-center">
                        <img className="size-16 rounded-lg" src={item.gambar} alt={item.nama} />
                      </div>
                      <div className="w-full self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                        <div className="flex-1 text-black text-base font-medium font-[Geist] leading-normal">{item.nama}</div>
                      </div>
                      <div className="w-full max-w-[15%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                        <Kategori value={item.kategori} />
                      </div>
                      <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                        <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.harga}</div>
                      </div>
                      <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                        <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.stok}</div>
                      </div>
                      <div className="w-full max-w-[15%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                        <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.penjual}</div>
                      </div>
                      <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                        <div className="flex gap-4">
                          {/* Icon Trash (kiri) */}
                          <button
                            className="size-6 flex items-center justify-center"
                            aria-label="Delete"
                            onClick={() => alert('Fitur hapus belum diimplementasikan')}
                          >
                            <img src="/trash.svg" alt="Delete" className="size-5" />
                          </button>
                          {/* Icon Edit (kanan) */}
                          <button
                            className="size-6 flex items-center justify-center"
                            aria-label="Edit"
                            onClick={() => setEditIndex(idx)}
                          >
                            <img src="/pensil.svg" alt="Edit" className="size-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination */}
                <div className="w-[1040px] flex justify-center items-center gap-2 mt-4 mx-auto">
                  <div className="flex items-center gap-2">
                    {/* Left Arrow */}
                    <button
                      className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                      aria-label="Previous Page"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                        <path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <div className="text-17-SOFT-BLACK text-base font-medium font-[Geist] leading-normal">1</div>
                    <div className="text-SIDEBAR-MODULE text-base font-medium font-[Geist] leading-normal">...</div>
                    <div className="text-SIDEBAR-MODULE text-base font-medium font-[Geist] leading-normal">6</div>
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
          </div>
        </div>
        {/* Success Notification */}
        {/* <div className="h-12 p-4 left-[527px] top-[1058px]  bg-fill-success rounded-xl shadow-[0px_4px_8px_0px_rgba(0,0,0,0.02)] shadow-[0px_8px_16px_-0.5px_rgba(0,0,0,0.02)] shadow-[0px_0px_0px_1px_rgba(41,122,58,0.32)] shadow-[0px_12px_24px_-1.5px_rgba(0,0,0,0.04)] shadow-[0px_16px_32px_-3px_rgba(0,0,0,0.04)] outline outline-1 outline-offset-[-1px] flex items-center gap-12 overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="size-6 relative overflow-hidden">
            <div className="size-5 left-[2px] top-[1.99px]  outline-2 outline-offset-[-1px] outline-foreground-success" />
          </div>
          <div className="text-foreground-success text-base font-medium font-['Inter'] leading-normal">Barang berhasil ditambahkan ke keranjang</div>
        </div>
      </div> */}
      </div>
    </div>
  );
}