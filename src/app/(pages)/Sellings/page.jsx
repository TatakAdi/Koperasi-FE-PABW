"use client";

import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getAllCart, updateCartStatus } from "@/app/lib/api/cart";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { useEffect, useMemo, useState } from "react";

function formatRupiah(angka) {
  if (angka === null || angka === undefined || isNaN(Number(angka)))
    return "Rp. 0";
  return `Rp. ${Number(angka).toLocaleString("id-ID")}`;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString.split("T")[0];
  }
}

export default function SellingsPage() {
  const [keyword, setKeyword] = useInput("");
  const [authUser, setAuthUser] = useState(null);

  const [allCartsData, setAllCartsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("Sedang Proses");
  const [selectedRow, setSelectedRow] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await getUserLogged();
      if (error) {
        console.error("Token Invalid & Data user gagal terambil:", error);

        return;
      }
      setAuthUser(data);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { error: fetchError, data: apiResponse } = await getAllCart();
        if (fetchError) {
          throw new Error(
            fetchError.message || "Gagal mengambil data penjualan"
          );
        }
        if (apiResponse && Array.isArray(apiResponse.data)) {
          setAllCartsData(apiResponse.data);
        } else {
          console.error("Format data API tidak sesuai:", apiResponse);
          setAllCartsData([]);
        }
      } catch (e) {
        console.error("Error fetching sales data:", e);
        setError(e.message);
        setAllCartsData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSalesData();
  }, []);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  const filteredSalesData = useMemo(() => {
    if (!allCartsData) return [];
    return allCartsData
      .filter((cart) => {
        if (activeTab === "Sedang Proses")
          return (
            cart.status_barang === "menunggu pegawai" && cart.total_harga > 0
          );
        if (activeTab === "Dikirim")
          return cart.status_barang === "akan dikirim";
        if (activeTab === "Selesai")
          return cart.status_barang === "diterima pembeli";
        return false;
      })
      .map((cart) => ({
        id: cart.cart_id,
        nama: cart.user?.fullname || `User ID: ${cart.user_id}` || "N/A",
        metode: cart.metode_pengiriman || "Diantar",
        lokasi: cart.lokasi_gedung || "-",
        tanggal: formatDate(cart.created_at),
        status_barang: cart.status_barang,

        originalCartData: cart,
        detail:
          cart.items?.map((item) => ({
            barang: item.name || "Nama Barang Tidak Ada",
            harga: formatRupiah(item.price),
            jumlah: item.jumlah,
            total: formatRupiah(item.subtotal),
          })) || [],
        totalPembelianDisplay:
          cart.items?.reduce(
            (sum, item) => sum + (Number(item.jumlah) || 0),
            0
          ) || 0,
      }));
  }, [allCartsData, activeTab]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = useMemo(() => {
    return filteredSalesData.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredSalesData, indexOfFirstItem, indexOfLastItem]);

  const totalPages = Math.ceil(filteredSalesData.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
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

  const tabList = [
    { label: "Sedang Proses" },
    { label: "Dikirim" },
    { label: "Selesai" },
  ];

  const handleRowClick = (rowData) => {
    setSelectedRow(rowData);
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleStatusUpdate = async (cartId) => {
    setUpdateLoading(true);
    try {
      // Get the cart data to find user_id
      const cartData = currentTableData.find((row) => row.id === cartId);
      if (!cartData?.originalCartData?.user_id) {
        showNotification("Data pengguna tidak ditemukan", "error");
        return;
      }

      const userId = cartData.originalCartData.user_id;
      console.log("Updating status for user:", userId);

      const response = await updateCartStatus(userId, "akan dikirim");

      if (!response.error) {
        showNotification("Status berhasil diperbarui", "success");
        // Refresh data
        const { error: fetchError, data: apiResponse } = await getAllCart();
        if (!fetchError && apiResponse?.data) {
          setAllCartsData(apiResponse.data);
        }
      } else {
        showNotification(
          response.message || "Gagal memperbarui status",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      showNotification("Terjadi kesalahan saat memperbarui status", "error");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
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
      <div className="w-full flex flex-row flex-1">
        {" "}
        {/* flex-1 agar konten mengisi sisa ruang */}
        <SidebarAdmin />
        {/* Main Content - tambahkan overflow-y-auto jika konten bisa panjang */}
        <main className="flex-1 p-5 overflow-y-auto">
          {/* Title & Tabs or Breadcrumb */}
          <div className="w-full mb-6">
            {" "}
            {/* mb-6 untuk spasi bawah */}
            {!selectedRow ? (
              <>
                <div className="flex flex-col gap-2 mb-6">
                  {" "}
                  {/* mb-6 untuk spasi bawah */}
                  <h1 className="text-black text-2xl font-medium font-[Geist]">
                    Manage Sales
                  </h1>
                  <p className="text-neutral-500 text-base font-medium font-[Geist]">
                    Lihat riwayat dari barang yang terjual
                  </p>
                </div>
                {/* Tabs */}
                <div className="h-9 inline-flex gap-6 border-b border-neutral-200 w-full">
                  {tabList.map((tab) => (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.label);
                        setSelectedRow(null);
                        setCurrentPage(1);
                      }}
                      className="bg-transparent border-none outline-none px-1 pb-2 cursor-pointer"
                    >
                      <div className="flex flex-col items-start">
                        <span
                          className={`text-lg font-medium font-['Geist'] transition-colors ${
                            activeTab === tab.label
                              ? "text-black"
                              : "text-neutral-400 hover:text-neutral-600"
                          }`}
                        >
                          {tab.label}
                        </span>
                        {activeTab === tab.label && (
                          <div className="w-full h-1 bg-black rounded-t-sm mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="inline-flex items-center gap-2 my-4">
                {" "}
                {/* my-4 untuk spasi atas bawah */}
                <button
                  onClick={() => setSelectedRow(null)}
                  className="text-neutral-500 hover:text-neutral-700 text-base font-normal font-['Geist'] leading-tight cursor-pointer"
                >
                  Manage Sales
                </button>
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path
                    d="M8 6L12 10L8 14"
                    stroke="#A3A3A3"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-black text-base font-medium font-['Geist'] leading-tight">
                  Sales Details
                </span>
              </div>
            )}
          </div>

          {/* Main Table or Detail View */}
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Memuat data penjualan...
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">Error: {error}</div>
          ) : !selectedRow ? (
            <div className="w-full flex flex-col gap-0">
              {" "}
              {/* gap-0 agar border menyatu */}
              {/* Table Header (disesuaikan agar segaris dengan row) */}
              <div className="w-full flex items-center border-b border-neutral-200 bg-gray-50">
                <div className="flex-1 h-14 flex items-center gap-2 px-4 border-r border-neutral-200">
                  <img src="/Person.svg" alt="person" className="size-5" />
                  <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
                    Nama Pembeli
                  </span>
                </div>
                <div className="flex-1 h-14 flex items-center gap-2 px-4 border-r border-neutral-200">
                  <img src="/Delivery.svg" alt="delivery" className="size-5" />
                  <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
                    Metode Pengiriman
                  </span>
                </div>
                <div className="flex-1 h-14 flex items-center gap-2 px-4 border-r border-neutral-200">
                  <img src="/Build.svg" alt="build" className="size-5" />
                  <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
                    Lokasi Gedung
                  </span>
                </div>
                <div className="flex-1 h-14 flex items-center gap-2 px-4">
                  {" "}
                  {/* Kolom terakhir tanpa border-r */}
                  <img src="/Uang.svg" alt="uang" className="size-5" />
                  <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
                    Transaction Date
                  </span>
                </div>
                {activeTab === "Sedang Proses" && (
                  <div className="w-32 h-14 flex items-center gap-2 px-4 border-l border-neutral-200">
                    <span className="text-neutral-500 text-base font-medium font-['Geist'] leading-normal">
                      Aksi
                    </span>
                  </div>
                )}
              </div>
              {/* Table Rows */}
              {currentTableData.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  Tidak ada data penjualan untuk tab "{activeTab}".
                </div>
              ) : (
                currentTableData.map((row) => (
                  <div
                    key={row.id}
                    className="w-full flex items-center border-b border-neutral-200 hover:bg-gray-50 transition text-left cursor-pointer"
                    onClick={() => handleRowClick(row)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleRowClick(row);
                      }
                    }}
                  >
                    <div className="flex-1 min-w-0 py-3 px-4 h-auto md:h-14 flex items-center border-r border-neutral-200">
                      <span
                        className="text-black text-base font-medium font-['Geist'] leading-normal truncate"
                        title={row.nama}
                      >
                        {row.nama}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 py-3 px-4 h-auto md:h-14 flex items-center border-r border-neutral-200">
                      <span
                        className="text-black text-base font-medium font-['Geist'] leading-normal truncate"
                        title={row.metode}
                      >
                        {row.metode}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 py-3 px-4 h-auto md:h-14 flex items-center border-r border-neutral-200">
                      <span
                        className="text-black text-base font-medium font-['Geist'] leading-normal truncate"
                        title={row.lokasi}
                      >
                        {row.lokasi}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 py-3 px-4 h-auto md:h-14 flex items-center">
                      <span className="text-black text-base font-medium font-['Geist'] leading-normal">
                        {row.tanggal}
                      </span>
                    </div>
                    {activeTab === "Sedang Proses" && (
                      <div className="w-32 py-3 px-4 h-auto md:h-14 flex items-center justify-center border-l border-neutral-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            // Pass the row id which is cart_id
                            handleStatusUpdate(row.id);
                          }}
                          disabled={updateLoading}
                          className="px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {updateLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                          ) : (
                            "Kirim"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
              {/* Pagination */}
              {totalPages > 1 && currentTableData.length > 0 && (
                <div className="w-full flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 sm:size-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Halaman Sebelumnya"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                      <path
                        d="M10 12L6 8L10 4"
                        stroke="#888"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {getPaginationGroup().map((pageItem, index) => (
                    <div key={`${pageItem}-${index}`}>
                      {pageItem === "..." ? (
                        <div className="text-gray-500 text-base sm:text-base font-medium font-['Geist'] leading-normal px-1">
                          ...
                        </div>
                      ) : (
                        <button
                          onClick={() => paginate(pageItem)}
                          className={`px-2 py-1 sm:size-6 min-w-[24px] sm:min-w-[unset] flex items-center justify-center rounded transition text-base sm:text-base ${
                            currentPage === pageItem
                              ? "bg-gray-300 text-black font-semibold"
                              : "hover:bg-gray-200 text-gray-500"
                          }`}
                        >
                          {pageItem}
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1 sm:size-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Halaman Berikutnya"
                  >
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
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
              )}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col justify-start items-start gap-6">
              <div>
                <h2 className="text-black text-[24px] font-medium font-['Geist']">
                  {selectedRow.nama}
                </h2>
                <p className="text-neutral-500 text-base font-medium font-['Geist']">
                  Detail pembelian
                </p>
              </div>
              {/* Tabel Detail Item */}
              <div className="w-full flex flex-col">
                {/* Header Tabel Detail */}
                <div className="w-full flex items-center border-b border-neutral-200 bg-gray-50">
                  <div className="w-full flex h-12 items-center px-4 border-r border-neutral-200">
                    <img src="/Box.svg" alt="box" className="size-5 mr-2" />
                    <span className="text-neutral-500 text-base font-medium font-['Geist']">
                      Nama Barang
                    </span>
                  </div>
                  <div className="w-full h-12 flex items-center px-4 border-r border-neutral-200">
                    <img src="/Tag.svg" alt="tag" className="size-5 mr-2" />
                    <span className="text-neutral-500 text-base font-medium font-['Geist']">
                      Harga
                    </span>
                  </div>
                  <div className="w-full h-12 flex items-center px-4 border-r border-neutral-200">
                    <img src="/Cart2.svg" alt="cart" className="size-5 mr-2" />
                    <span className="text-neutral-500 text-base font-medium font-['Geist']">
                      Jumlah
                    </span>
                  </div>
                  <div className="w-full h-12 flex items-center px-4">
                    <img src="/Uang.svg" alt="uang" className="size-5 mr-2" />
                    <span className="text-neutral-500 text-base font-medium font-['Geist']">
                      Total Harga
                    </span>
                  </div>
                </div>
                {/* Baris Detail Item */}
                {selectedRow.detail.map((item, idx) => (
                  <div
                    key={idx}
                    className="w-full flex items-center border-b border-neutral-200"
                  >
                    <div className="w-full flex min-w-0 py-3 px-4 h-auto md:h-14 items-center border-r border-neutral-200">
                      <span
                        className="text-black text-base font-medium font-['Geist'] truncate"
                        title={item.barang}
                      >
                        {item.barang}
                      </span>
                    </div>
                    <div className="w-full flex py-3 px-4 h-auto md:h-14 items-center border-r border-neutral-200">
                      <span className="text-black text-base font-medium font-['Geist']">
                        {item.harga}
                      </span>
                    </div>
                    <div className="w-full py-3 px-4 h-auto md:h-14 flex items-center border-r border-neutral-200">
                      <span className="text-black text-base font-medium font-['Geist']">
                        {item.jumlah}
                      </span>
                    </div>
                    <div className="w-full py-3 px-4 h-auto md:h-14 flex items-center">
                      <span className="text-black text-base font-medium font-['Geist']">
                        {item.total}
                      </span>
                    </div>
                  </div>
                ))}
                {/* Total Pembelian (Order Qts) */}
                <div className="w-full flex items-center border-y border-[#808080]">
                  <div className="w-full py-3 px-4 h-14 flex items-center font-semibold text-black">
                    Total Pembelian (Order Qts)
                  </div>
                  <div className="w-full py-3 px-4 h-auto md:h-14 flex items-center"></div>
                  <div className="w-full py-3 px-4 h-auto md:h-14 flex items-center"></div>
                  <div className="w-full py-3 px-4 h-14 flex items-center justify-center font-semibold text-black border-l border-[#808080]">
                    {selectedRow.totalPembelianDisplay}
                  </div>
                </div>
              </div>
              {/* Tombol kembali */}
              <div className="mt-6 self-start">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition font-medium cursor-pointer"
                  onClick={() => setSelectedRow(null)}
                >
                  Kembali ke Daftar Penjualan
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
