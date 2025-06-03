"use client";

import FormProduct from "@/app/components/FormProduct";
import Kategori from "@/app/components/Kategori";
import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { deleteProduct, getProduct } from "@/app/lib/api/product";
import Image from "next/image";

import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProductPage() {
  const [keyword, setKeyword] = useInput("");
  const [authUser, setAuthUser] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formMode, setFormMode] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const onLogoutHandler = useCallback(async () => {
    await logout();
    setAuthUser(null);
  }, []);

  function formatRupiah(angka) {
    if (angka === null || angka === undefined || angka === "") return "Rp. 0";
    const number =
      typeof angka === "string"
        ? parseInt(angka.toString().replace(/[^0-9]/g, ""), 10)
        : angka;
    if (isNaN(number)) return "Rp. 0";
    return `Rp. ${number.toLocaleString("id-ID")}`;
  }

  const fetchProductsData = useCallback(async () => {
    setIsLoadingData(true);
    const { error, data } = await getProduct();
    if (error) {
      console.error("Gagal mengambil data produk:", error);
      setAllProducts([]);
      window.alert("Gagal mengambil data produk. Silakan coba lagi.");
    } else {
      const sortedData = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        : [];
      setAllProducts(sortedData);
    }
    setIsLoadingData(false);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const { error: userError, data: userData } = await getUserLogged();
      if (userError) {
        console.log("Token Invalid & Data user gagal terambil:", userError);
      }
      setAuthUser(userData);

      if (userData) {
        await fetchProductsData();
      } else {
        setIsLoadingData(false);
        setAllProducts([]);
      }
    };
    fetchInitialData();
  }, [fetchProductsData]);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    if (!keyword) {
      return allProducts;
    }
    const lowercasedKeyword = keyword.toLowerCase();
    return allProducts.filter(
      (product) =>
        product.name?.toLowerCase().includes(lowercasedKeyword) ||
        (product.category &&
          product.category.name?.toLowerCase().includes(lowercasedKeyword)) ||
        (product.user &&
          product.user.fullname?.toLowerCase().includes(lowercasedKeyword))
    );
  }, [allProducts, keyword]);

  const handleOpenEditForm = useCallback((product) => {
    const productId = product?.id;
    if (
      productId === undefined ||
      productId === null ||
      String(productId).trim() === "" ||
      String(productId).toLowerCase() === "undefined"
    ) {
      console.error(
        "[Page] CRITICAL: Mencoba mengedit produk dengan ID yang tidak valid!",
        product
      );
      window.alert(
        "Error: Produk yang dipilih memiliki ID yang tidak valid atau kosong."
      );
      return;
    }
    setProductToEdit(product);
    setFormMode("edit");
  }, []);

  const handleCloseForm = useCallback(() => {
    setFormMode(null);
    setProductToEdit(null);
  }, []);

  const handleFormSaveSuccess = useCallback(async () => {
    handleCloseForm();
    await fetchProductsData();
  }, [handleCloseForm, fetchProductsData]);

  const handleDeleteProduct = useCallback(
    async (productId, productName) => {
      if (
        productId === undefined ||
        productId === null ||
        String(productId).trim() === "" ||
        String(productId).toLowerCase() === "undefined"
      ) {
        console.error(
          "[Page] CRITICAL: ID Produk tidak valid untuk dihapus!",
          productId
        );
        window.alert("Error: ID Produk tidak valid untuk dihapus.");
        return;
      }
      if (
        window.confirm(
          `Apakah Anda yakin ingin menghapus produk "${productName}"? Tindakan ini tidak dapat diurungkan.`
        )
      ) {
        setIsLoading(true);
        const { error, status, message, data } = await deleteProduct(productId);
        setIsLoading(false);

        if (error) {
          let detailErrorMessage =
            message || `Gagal menghapus produk "${productName}".`;
          if (status) {
            detailErrorMessage += ` Status: ${status}.`;
          }
          if (typeof error === "string")
            detailErrorMessage += ` Error: ${error}`;
          else if (typeof error === "object" && error.message)
            detailErrorMessage += ` Error: ${error.message}`;

          console.error("Gagal menghapus produk:", detailErrorMessage, data);
          window.alert(detailErrorMessage);
        } else {
          window.alert(
            data?.message || `Produk "${productName}" berhasil dihapus!`
          );
          await fetchProductsData();
        }
      }
    },
    [fetchProductsData]
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (
      totalPages === 0 &&
      filteredProducts.length === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [filteredProducts, currentPage, totalPages]);

  const paginate = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages && totalPages > 0) {
        setCurrentPage(pageNumber);
      } else if (totalPages === 0 && pageNumber === 1) {
        setCurrentPage(1);
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const getPaginationGroup = useCallback(() => {
    if (totalPages === 0) return [];
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
      if (i > 0 && i <= totalPages) pages.push(i);
    }
    if (end < totalPages && totalPages > 5) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  if (formMode === "edit") {
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
        <div className="flex flex-1 overflow-hidden">
          <SidebarAdmin />
          <FormProduct
            productData={productToEdit}
            onClose={handleCloseForm}
            onSaveSuccess={handleFormSaveSuccess}
          />
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
      <div className="flex flex-1 overflow-hidden">
        <SidebarAdmin />
        <main className="flex-1 p-5 overflow-y-auto">
          <div className="w-full">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-2">
                  <div className="text-black text-2xl font-medium font-[Geist]">
                    Data Barang
                  </div>
                  <div className="text-neutral-500 text-base font-medium font-[Geist]">
                    Lihat rincian dari produk yang tersedia
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="w-full border-b border-[#E5E5E5] flex flex-col justify-start items-start gap-2.5">
                  <div className="self-stretch inline-flex justify-start items-center bg-gray-50">
                    <div className="w-24 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Gambar
                      </div>
                    </div>
                    <div className="flex-1 h-14 min-w-[150px] border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Nama Barang
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-48 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Kategori
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-32 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Harga
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-28 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Stok
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-32 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Penjual
                      </div>
                    </div>
                    <div className="w-24 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">
                        Aksi
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col">
                  {isLoadingData ? (
                    <div className="text-center py-8 text-gray-500">
                      Memuat data produk...
                    </div>
                  ) : currentProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {keyword
                        ? `Tidak ada produk yang cocok dengan "${keyword}".`
                        : "Tidak ada produk yang tersedia."}
                    </div>
                  ) : (
                    currentProducts.map((item) => {
                      let displayImageUrl = item.image_url;
                      if (
                        displayImageUrl &&
                        typeof displayImageUrl === "string" &&
                        displayImageUrl.startsWith("local:")
                      ) {
                        displayImageUrl = displayImageUrl.replace(
                          "local:",
                          "/"
                        );
                      } else if (!displayImageUrl) {
                        displayImageUrl = "/image.png";
                      }

                      return (
                        <div
                          key={item.id || `product-${Math.random()}`}
                          className="border-b border-[#E5E5E5] inline-flex justify-start items-center min-h-[80px] hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-24 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                            <Image
                              className="size-16 rounded-lg object-cover"
                              src={displayImageUrl}
                              alt={item.name || "Gambar Produk"}
                              width={64}
                              height={64}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/image.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 self-stretch min-w-[150px] p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                            <div className="flex-1 text-center text-black text-sm md:text-base font-medium font-['Geist'] leading-normal break-words">
                              {item.name || "Nama Tidak Ada"}
                            </div>
                          </div>
                          <div className="flex-1 self-stretch max-w-48 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                            <Kategori value={item.category?.name} />
                          </div>
                          <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                            <div className="flex-1 text-center text-black text-sm md:text-base font-medium font-['Geist'] leading-normal">
                              {formatRupiah(item.price)}
                            </div>
                          </div>
                          <div className="flex-1 self-stretch max-w-28 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                            <div className="flex-1 text-center text-black text-sm md:text-base font-medium font-['Geist'] leading-normal">
                              {item.stock ?? "0"}
                            </div>
                          </div>
                          <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                            <div className="flex-1 text-center text-black text-sm md:text-base font-medium font-['Geist'] leading-normal">
                              {item.user?.fullname || "N/A"}
                            </div>
                          </div>
                          <div className="w-24 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                            <button
                              onClick={() =>
                                handleDeleteProduct(item.id, item.name)
                              }
                              aria-label={`Hapus ${item.name}`}
                              className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                            >
                              <Image
                                src="/Trash.svg"
                                alt="Hapus"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                              />
                            </button>
                            <button
                              onClick={() => handleOpenEditForm(item)}
                              aria-label={`Edit ${item.name}`}
                              className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                            >
                              <Image
                                src="/Pensil.svg"
                                alt="Edit"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                      <div className="text-black text-lg font-medium">
                        Memproses...
                      </div>
                    </div>
                  )}
                </div>
                {totalPages > 0 && !isLoadingData && (
                  <div className="w-full mt-6 flex justify-center items-center gap-2">
                    <div className="flex justify-center items-center gap-1 sm:gap-2">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
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
                      {getPaginationGroup().map((pageItem, index) => (
                        <div key={`${pageItem}-${index}`}>
                          {" "}
                          {/* Key unik */}
                          {pageItem === "..." ? (
                            <div className="text-gray-500 text-sm sm:text-base font-medium font-['Geist'] leading-normal px-1">
                              ...
                            </div>
                          ) : (
                            <button
                              onClick={() => paginate(pageItem)}
                              className={`px-2 py-1 sm:size-6 min-w-[24px] sm:min-w-[unset] flex items-center justify-center rounded transition text-sm sm:text-base ${
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
                        onClick={nextPage}
                        disabled={
                          currentPage === totalPages || totalPages === 0
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
