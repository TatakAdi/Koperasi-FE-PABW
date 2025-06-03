"use client";

import { cartHistory } from "@/app/lib/api/cartHistory";
import Navbar from "app/components/Navbar";
import Riwayat from "app/components/Riwayat";
import SidebarAdmin from "app/components/SidebarAdmin";
import useInput from "app/hooks/useInput";
import { getAllCart } from "app/lib/api/cart";
import { getUserLogged } from "app/lib/api/login";
import { logout } from "app/lib/api/logout";
import { useEffect, useMemo, useState } from "react";

function formatRupiah(angka) {
  if (angka === null || angka === undefined || isNaN(Number(angka)))
    return "Rp. 0";
  return `Rp. ${Number(angka).toLocaleString("id-ID")}`;
}

export default function StatAdminPage() {
  const [keyword, setKeyword] = useInput("");
  const [authUser, setAuthUser] = useState(null);

  const [soldProducts, setSoldProducts] = useState([]);
  const [isLoadingSoldProducts, setIsLoadingSoldProducts] = useState(true);
  const [currentSoldProductsPage, setCurrentSoldProductsPage] = useState(1);
  const [soldProductsPerPage] = useState(5);

  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalPenjualanProduk, setTotalPenjualanProduk] = useState(0);
  const [totalPengiriman, setTotalPengiriman] = useState(0);
  const [isLoadingProfitDetails, setIsLoadingProfitDetails] = useState(true);

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
    const fetchDataForStats = async () => {
      if (!authUser) return;

      setIsLoadingSoldProducts(true);
      setIsLoadingProfitDetails(true);

      try {
        let apiResponse;

        if (authUser.tipe === "pengguna" || authUser.tipe === "penitip") {
          // Use cartHistory for regular users
          const result = await cartHistory(authUser.id);
          if (result.error) {
            throw new Error("Failed to fetch cart history");
          }
          apiResponse = result;
        } else {
          // Use getAllCart for admin/pegawai
          const { error: fetchError, data: response } = await getAllCart();
          if (fetchError) {
            throw new Error("Failed to fetch all carts");
          }
          apiResponse = response;
        }

        if (apiResponse && Array.isArray(apiResponse.data)) {
          const allCarts = apiResponse.data;

          // Calculate pengiriman total
          let currentTotalPengiriman = 0;
          allCarts.forEach((cart) => {
            if (
              cart.status_barang === "akan dikirim" ||
              cart.status_barang === "diterima pembeli"
            ) {
              currentTotalPengiriman++;
            }
          });
          setTotalPengiriman(currentTotalPengiriman);

          // Filter paid carts
          const paidCarts = allCarts.filter(
            (cart) => cart.status === "Paid" || cart.sudah_bayar === 1
          );

          setTotalTransaksi(paidCarts.length);

          let allLineItemsFromPaidCarts = [];
          let currentTotalPenjualanProduk = 0;

          // Process cart items
          paidCarts.forEach((cart) => {
            if (Array.isArray(cart.items)) {
              cart.items.forEach((item) => {
                const quantity = Number(item.jumlah) || 0;
                allLineItemsFromPaidCarts.push({
                  product_name: item.name || "Produk Tidak Diketahui",
                  quantity: quantity,
                  total_price_for_item: Number(item.subtotal) || 0,
                });
                currentTotalPenjualanProduk += quantity;
              });
            }
          });

          setTotalPenjualanProduk(currentTotalPenjualanProduk);

          // Aggregate products data
          const aggregated = allLineItemsFromPaidCarts.reduce((acc, item) => {
            const productName = item.product_name;
            if (!acc[productName]) {
              acc[productName] = {
                name: productName,
                sold: 0,
                totalRevenue: 0,
              };
            }
            acc[productName].sold += item.quantity;
            acc[productName].totalRevenue += item.total_price_for_item;
            return acc;
          }, {});

          const finalSoldProducts = Object.values(aggregated).map((prod) => ({
            ...prod,
            price: formatRupiah(prod.totalRevenue),
          }));

          setSoldProducts(finalSoldProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSoldProducts([]);
        setTotalTransaksi(0);
        setTotalPenjualanProduk(0);
        setTotalPengiriman(0);
      } finally {
        setIsLoadingSoldProducts(false);
        setIsLoadingProfitDetails(false);
      }
    };

    if (authUser) {
      fetchDataForStats();
    }
  }, [authUser]);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  const indexOfLastSoldProduct = currentSoldProductsPage * soldProductsPerPage;
  const indexOfFirstSoldProduct = indexOfLastSoldProduct - soldProductsPerPage;
  const currentDisplayedSoldProducts = useMemo(() => {
    return soldProducts.slice(indexOfFirstSoldProduct, indexOfLastSoldProduct);
  }, [soldProducts, indexOfFirstSoldProduct, indexOfLastSoldProduct]);

  const totalSoldProductsPages = Math.ceil(
    soldProducts.length / soldProductsPerPage
  );

  const paginateSoldProducts = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalSoldProductsPages) {
      setCurrentSoldProductsPage(pageNumber);
    }
  };

  const getSoldProductsPaginationGroup = () => {
    let start = Math.max(1, currentSoldProductsPage - 2);
    let end = Math.min(totalSoldProductsPages, currentSoldProductsPage + 2);
    const pages = [];
    if (totalSoldProductsPages <= 5) {
      start = 1;
      end = totalSoldProductsPages;
    } else {
      if (currentSoldProductsPage <= 3) {
        start = 1;
        end = 5;
      } else if (currentSoldProductsPage >= totalSoldProductsPages - 2) {
        start = totalSoldProductsPages - 4;
        end = totalSoldProductsPages;
      }
    }
    if (start > 1 && totalSoldProductsPages > 5) {
      pages.push(1);
      if (start > 2) {
        pages.push("...");
      }
    }
    for (let i = start; i <= end; i++) {
      if (i > 0) pages.push(i);
    }
    if (end < totalSoldProductsPages && totalSoldProductsPages > 5) {
      if (end < totalSoldProductsPages - 1) {
        pages.push("...");
      }
      pages.push(totalSoldProductsPages);
    }
    return pages;
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
        <SidebarAdmin />
        <main className="flex-1 p-5 overflow-y-auto">
          {/* Profit Details Section */}
          <div className="w-full mb-12">
            <div className="flex flex-col gap-2 mb-6">
              <h1 className="text-black text-2xl font-medium font-[Geist]">
                Profit Details
              </h1>
              <p className="text-neutral-500 text-base font-medium font-[Geist]">
                Lihat riwayat dari pendapatan
              </p>
            </div>
            {isLoadingProfitDetails ? (
              <div className="text-center py-4 text-gray-500">
                Memuat detail profit...
              </div>
            ) : (
              <Riwayat
                totalTransaksi={totalTransaksi}
                totalPenjualan={totalPenjualanProduk}
                totalPengiriman={totalPengiriman}
              />
            )}
          </div>

          {/* Products Sold Table Section */}
          <div className="w-full">
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-black text-2xl font-medium font-[Geist]">
                Products Sold
              </h2>
              <p className="text-neutral-500 text-base font-medium font-[Geist]">
                Lihat riwayat dari barang yang terjual
              </p>
            </div>
            <div className="w-full flex flex-col">
              <div className="w-full flex items-center border-b border-neutral-200">
                <div className="flex-1 h-14 flex items-center gap-2 px-3 border-r border-neutral-200">
                  <img src="/Box.svg" alt="Nama Barang" className="size-6" />
                  <span className="text-[#737373] text-base font-medium font-[Geist] leading-normal">
                    Nama Barang
                  </span>
                </div>
                <div className="flex-1 h-14 flex items-center gap-2 px-3 border-r border-neutral-200">
                  <img
                    src="/Cart2.svg"
                    alt="Jumlah Terjual"
                    className="size-6"
                  />
                  <span className="text-[#737373] text-base font-medium font-[Geist] leading-normal">
                    Jumlah Terjual
                  </span>
                </div>
                <div className="flex-1 h-14 flex items-center gap-2 px-3">
                  <img src="/Tag.svg" alt="Total Harga" className="size-6" />
                  <span className="text-[#737373] text-base font-medium font-[Geist] leading-normal">
                    Total Harga
                  </span>
                </div>
              </div>

              {isLoadingSoldProducts ? (
                <div className="text-center py-8 text-gray-500">
                  Memuat data produk terjual...
                </div>
              ) : currentDisplayedSoldProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada produk terjual yang ditemukan.
                </div>
              ) : (
                <div className="w-full flex flex-col">
                  {currentDisplayedSoldProducts.map((item, idx) => (
                    <div
                      key={item.name + idx}
                      className="w-full flex items-center border-b border-neutral-200 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0 py-3 px-3 h-14 flex items-center border-r border-neutral-200">
                        <span
                          className="text-black text-sm sm:text-base font-medium font-[Geist] leading-normal truncate"
                          title={item.name}
                        >
                          {item.name}
                        </span>
                      </div>
                      <div className="flex-1 py-3 px-3 h-14 flex items-center border-r border-neutral-200">
                        <span className="text-black text-sm sm:text-base font-medium font-[Geist] leading-normal">
                          {item.sold}
                        </span>
                      </div>
                      <div className="flex-1 py-3 px-3 h-14 flex items-center">
                        <span className="text-black text-sm sm:text-base font-medium font-[Geist] leading-normal">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalSoldProductsPages > 1 &&
                !isLoadingSoldProducts &&
                currentDisplayedSoldProducts.length > 0 && (
                  <div className="w-full flex justify-center items-center gap-2 mt-6">
                    <button
                      onClick={() =>
                        paginateSoldProducts(currentSoldProductsPage - 1)
                      }
                      disabled={currentSoldProductsPage === 1}
                      className="p-1 sm:size-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Halaman Sebelumnya"
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
                    {getSoldProductsPaginationGroup().map((pageItem, index) => (
                      <div key={`${pageItem}-${index}`}>
                        {pageItem === "..." ? (
                          <div className="text-gray-500 text-sm sm:text-base font-medium font-['Geist'] leading-normal px-1">
                            ...
                          </div>
                        ) : (
                          <button
                            onClick={() => paginateSoldProducts(pageItem)}
                            className={`px-2 py-1 sm:size-6 min-w-[24px] sm:min-w-[unset] flex items-center justify-center rounded transition text-sm sm:text-base ${
                              currentSoldProductsPage === pageItem
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
                      onClick={() =>
                        paginateSoldProducts(currentSoldProductsPage + 1)
                      }
                      disabled={
                        currentSoldProductsPage === totalSoldProductsPages
                      }
                      className="p-1 sm:size-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Halaman Berikutnya"
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
                )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
