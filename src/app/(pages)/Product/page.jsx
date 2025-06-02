'use client';

import Kategori from "@/app/components/Kategori";
import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { getProduct } from "@/app/lib/api/product"; // Import getProduct
import { useEffect, useState } from "react";

export default function ProductPage() {
  const [keyword, setKeyword] = useInput(''); // Inisialisasi dengan string kosong
  const [authUser, setAuthUser] = useState(null);
  const [allProducts, setAllProducts] = useState([]); // State untuk menyimpan semua data produk dari API
  const [displayedProducts, setDisplayedProducts] = useState([]); // State untuk produk yang akan ditampilkan (setelah filter dan pencarian)
  const [isLoading, setIsLoading] = useState(true); // Tambahkan state loading

  // State untuk mode edit dan data produk yang diedit
  const [editIndex, setEditIndex] = useState(null);

  // State untuk form edit
  const [editHarga, setEditHarga] = useState("");
  const [editStok, setEditStok] = useState("");
  const [editKategori, setEditKategori] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Kategori list
  const kategoriList = [
    { label: "Makanan Berat", value: "makanan berat" }, // Pastikan value sesuai dengan nama kategori dari API
    { label: "Makanan Ringan", value: "makanan ringan" },
    { label: "Minuman", value: "minuman" },
  ];

  // Untuk menampilkan label kategori dari value
  const getKategoriLabel = (val) => {
    const found = kategoriList.find((k) => k.value === val);
    return found ? k.label : val; // Return value jika tidak ditemukan
  };

  // Fungsi untuk memformat angka ke dalam format Rupiah
  function formatRupiah(angka) {
    if (angka === null || angka === undefined || angka === "") return "Rp. 0";
    const number = typeof angka === 'string' ? parseInt(angka.replace(/[^0-9]/g, ""), 10) : angka;
    if (isNaN(number)) return "Rp. 0";
    return `Rp. ${number.toLocaleString('id-ID')}`;
  }

  // Fetch product data
  const fetchProductsData = async () => {
    setIsLoading(true);
    const { error, data } = await getProduct();
    if (error) {
      console.error("Gagal mengambil data produk:", error);
      setAllProducts([]);
    } else {
      setAllProducts(data);
    }
    setIsLoading(false);
  };

  // Fetch user logged in
  useEffect(() => {
    const fetchUserLogged = async () => {
      const { error, data } = await getUserLogged();
      if (error) {
        console.log("Token Invalid & Data user gagal terambil");
        setAuthUser(null);
        return;
      }
      setAuthUser(data);
    };
    fetchUserLogged();
    fetchProductsData(); // Panggil juga fetchProductsData saat komponen di-mount
  }, []); // Dependensi kosong, hanya dijalankan sekali saat mount

  // Filter products based on user role and keyword
  useEffect(() => {
    let filtered = allProducts;

    // Filter berdasarkan peran pengguna
    if (authUser) {
      const userRole = authUser.tipe;
      const userId = authUser.id;

      if (userRole !== 'admin' && userRole !== 'pegawai') {
        // Jika bukan admin atau pegawai, hanya tampilkan produk yang ditambahkan sendiri
        filtered = filtered.filter(product => product.user_id === userId);
      }
    }

    // Filter berdasarkan keyword (nama, kategori, penjual)
    if (keyword) {
      const lowercasedKeyword = keyword.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(lowercasedKeyword) ||
        product.category.name.toLowerCase().includes(lowercasedKeyword) ||
        (product.user && product.user.fullname.toLowerCase().includes(lowercasedKeyword))
      );
    }
    
    setDisplayedProducts(filtered);
  }, [allProducts, authUser, keyword]); // Dependensi: allProducts, authUser, keyword

  // Inisialisasi state edit jika index berubah
  useEffect(() => {
    if (editIndex !== null && displayedProducts[editIndex]) {
      const productToEdit = displayedProducts[editIndex];
      setEditHarga(productToEdit.price.toString()); // price adalah angka
      setEditStok(productToEdit.stock.toString());
      setEditKategori(productToEdit.category.name); // category.name adalah string kategori
    }
  }, [editIndex, displayedProducts]); // Tambahkan displayedProducts sebagai dependensi

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  // Jika sedang edit, tampilkan tampilan edit sesuai desain
  if (editIndex !== null) {
    const product = displayedProducts[editIndex]; // Ambil dari displayedProducts

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
                <button 
                  className="text-SIDE-ICON text-base font-normal font-['Geist'] leading-tight hover:text-gray-700 cursor-pointer"
                  onClick={() => setEditIndex(null)} // Tombol kembali ke daftar produk
                >
                  Data Produk
                </button>
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
                onClick={() => { /* Lakukan update produk di sini */ setEditIndex(null); }} // Logika save
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
                      value={formatRupiah(editHarga).replace('Rp. ', '')} // Hapus "Rp. " agar input lebih mudah
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
                      onChange={e => setEditStok(e.target.value.replace(/[^0-9]/g, ""))} // Hanya angka
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
                      {getKategoriLabel(editKategori) || "Pilih Kategori"}
                    </div>
                    {/* Icon arrow bawah */}
                    <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                      <path d="M6 8L10 12L14 8" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {/* Dropdown list */}
                  {dropdownOpen && (
                    <div className="absolute top-[320px] left-[calc(320px+120px+16px)] w-[400px] bg-white rounded-md shadow-lg flex flex-col justify-start items-start z-10">
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

  // Jika tidak sedang edit, tampilkan daftar produk
  return (
    <div className="w-full h-full flex flex-col bg-white"> {/* Ubah h-[1024px] jadi h-full */}
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
      <div className="flex flex-1"> {/* Tambahkan flex-1 agar sidebar dan main content mengisi sisa ruang */}
        {/* Sidebar */}
        <SidebarAdmin />
        {/* Main Content */}
        <main className="flex-1 p-5 overflow-auto"> {/* Tambahkan flex-1 dan overflow-auto */}
          <div className="w-full">
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
                    {isLoading ? (
                      <div className="text-center py-8 text-gray-500">Loading produk...</div>
                    ) : displayedProducts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Tidak ada produk yang tersedia.</div>
                    ) : (
                      displayedProducts.map((item, idx) => (
                        <div key={item.id || idx} className="border-b border-neutral-200 flex items-center">
                          <div className="w-full self-stretch max-w-[10%] p-2 border-r border-neutral-200 flex justify-center items-center">
                            <img className="size-16 rounded-lg object-cover" src={item.image_url || "https://placehold.co/64x64"} alt={item.name} />
                          </div>
                          <div className="w-full self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                            <div className="flex-1 text-black text-base font-medium font-[Geist] leading-normal">{item.name}</div>
                          </div>
                          <div className="w-full max-w-[15%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                            <Kategori value={item.category.name} />
                          </div>
                          <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                            <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{formatRupiah(item.price)}</div>
                          </div>
                          <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                            <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.stock}</div>
                          </div>
                          <div className="w-full max-w-[15%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                            <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.user?.fullname || 'N/A'}</div>
                          </div>
                          <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                            <div className="flex gap-4">
                              {/* Icon Trash (kiri) */}
                              <button
                                className="size-6 flex items-center justify-center"
                                aria-label="Delete"
                                onClick={() => alert(`Fitur hapus untuk produk ${item.name} belum diimplementasikan`)}
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
                      ))
                    )}
                  </div>
                  {/* Pagination - Dummy saat ini, perlu diimplementasikan logika pagination real */}
                  <div className="w-[1040px] flex justify-center items-center gap-2 mt-4 mx-auto">
                    <div className="flex items-center gap-2">
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
        </main>
      </div>
    </div>
  );
}