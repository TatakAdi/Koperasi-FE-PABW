"use client";

import FormProductUser from "@/app/components/FormProductUser";
import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "@/app/lib/api/product";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function ProductManagementPage() {
  const [keyword, setKeyword] = useInput("");
  const [authUser, setAuthUser] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formMode, setFormMode] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [activeListingTab, setActiveListingTab] = useState("On Listing");

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  function formatRupiah(angka) {
    if (angka === null || angka === undefined || angka === "") return "Rp. 0";
    const number =
      typeof angka === "string"
        ? parseInt(angka.toString().replace(/[^0-9]/g, ""), 10)
        : angka;
    if (isNaN(number)) return "Rp. 0";
    return `Rp. ${number.toLocaleString("id-ID")}`;
  }

  const fetchProductsData = async () => {
    setIsLoadingData(true);
    console.log("[Page] Fetching products data...");
    const { error, data, status } = await getProduct();
    if (error) {
      console.error("Gagal mengambil data produk:", error, "Status:", status);
      setAllProducts([]);
      window.alert(`Gagal mengambil data produk: ${error}. Silakan coba lagi.`);
    } else {
      const sortedData = Array.isArray(data)
        ? data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        : [];
      console.log("[Page] Products data fetched:", sortedData);
      setAllProducts(sortedData);
    }
    setIsLoadingData(false);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const { error: userError, data: userData } = await getUserLogged();
      if (userError) {
        console.log("Token Invalid & Data user gagal terambil:", userError);
      }
      setAuthUser(userData);
      if (
        userData &&
        (userData.tipe === "admin" ||
          userData.tipe === "pegawai" ||
          userData.tipe === "penitip")
      ) {
        await fetchProductsData();
      } else {
        console.log(
          "[Page] Pengguna tidak diotorisasi untuk melihat produk atau tidak ada data pengguna."
        );
        setIsLoadingData(false);
        setAllProducts([]);
      }
    };
    fetchInitialData();
  }, []);

  const productsToDisplay = useMemo(() => {
    if (!allProducts) return [];
    let products = allProducts;

    if (authUser && authUser.tipe === "penitip") {
      products = products.filter(
        (product) =>
          product.user_id === authUser.id || product.user?.id === authUser.id
      );
    }

    if (!keyword) {
      return products;
    }
    const lowercasedKeyword = keyword.toLowerCase();
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(lowercasedKeyword) ||
        product.category?.name?.toLowerCase().includes(lowercasedKeyword) ||
        product.user?.fullname?.toLowerCase().includes(lowercasedKeyword)
    );
  }, [allProducts, keyword, authUser, activeListingTab]);

  const handleOpenAddForm = () => {
    console.log("[Page] Membuka form tambah produk.");
    setProductToEdit(null);
    setFormMode("add");
  };

  const handleOpenEditForm = (product) => {
    console.log("[Page] Membuka form edit untuk produk:", product);
    if (!product || product.id === undefined || product.id === null) {
      console.error(
        "CRITICAL: Mencoba mengedit produk tanpa ID yang valid!",
        product
      );
      window.alert("Error: Produk yang dipilih tidak memiliki ID yang valid.");
      return;
    }
    setProductToEdit(product);
    setFormMode("edit");
  };

  const handleCloseForm = () => {
    console.log("[Page] Menutup form.");
    setFormMode(null);
    setProductToEdit(null);
  };

  const handleSaveProduct = async (productDataFromForm) => {
    console.log(
      "[Page] handleSaveProduct - Menerima data dari form:",
      productDataFromForm
    );
    setIsLoading(true);
    let response;
    let successMessage = "";

    const formData = new FormData();
    Object.keys(productDataFromForm).forEach((key) => {
      if (key === "image_url" && productDataFromForm[key] instanceof File) {
        formData.append("image", productDataFromForm[key]);
      } else if (
        productDataFromForm[key] !== null &&
        productDataFromForm[key] !== undefined
      ) {
        if (key !== "id" || formMode === "add") {
          formData.append(key, productDataFromForm[key]);
        }
      }
    });

    if (formMode === "edit") {
      const productId = productDataFromForm.id;
      console.log(
        `[Page] Mode Edit - ID Produk: ${productId} (tipe: ${typeof productId})`
      );

      if (
        productId === undefined ||
        productId === null ||
        String(productId).trim() === "" ||
        String(productId).toLowerCase() === "undefined"
      ) {
        console.error(
          "CRITICAL: ID Produk tidak valid atau undefined saat mencoba update!",
          productId
        );
        window.alert(
          "Error: ID Produk tidak valid untuk pembaruan. Periksa konsol."
        );
        setIsLoading(false);
        return;
      }

      successMessage = "Produk berhasil diperbarui!";
      console.log(
        `[Page] Memanggil updateProduct dengan ID: ${productId} dan FormData.`
      );
      response = await updateProduct(productId, formData);
    } else if (formMode === "add") {
      if (formData.has("id")) {
        formData.delete("id");
      }
      successMessage = "Produk berhasil ditambahkan!";
      console.log("[Page] Memanggil addProduct dengan FormData.");
      response = await addProduct(formData);
    } else {
      console.error("[Page] Mode form tidak valid:", formMode);
      window.alert("Mode form tidak valid.");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    if (response && !response.error) {
      window.alert(successMessage);
      handleCloseForm();
      await fetchProductsData();
    } else {
      let detailErrorMessage = "Gagal menyimpan produk.";
      if (response && response.error) {
        if (
          typeof response.error === "string" &&
          response.error.trim() !== ""
        ) {
          detailErrorMessage = response.error;
        } else if (
          typeof response.error === "object" &&
          response.error.message
        ) {
          detailErrorMessage = response.error.message;
        } else if (response.status) {
          detailErrorMessage = `Gagal menyimpan produk. Status: ${
            response.status
          }. Error: ${response.error || "Tidak ada detail"}`;
        }
        if (response.trace) {
          console.error("Server Trace:", response.trace);
        }
      }
      console.error(
        "Gagal menyimpan produk:",
        response || "Respons tidak diketahui"
      );
      window.alert(detailErrorMessage);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    console.log(
      `[Page] Menghapus produk ID: ${productId}, Nama: ${productName}`
    );
    if (!productId) {
      console.error("CRITICAL: ID Produk tidak valid untuk dihapus!");
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
          detailErrorMessage += ` Status: ${status}. Error: ${error}`;
        }
        console.error("Gagal menghapus produk:", detailErrorMessage);
        window.alert(detailErrorMessage);
      } else {
        window.alert(
          data?.message || `Produk "${productName}" berhasil dihapus!`
        );
        await fetchProductsData();
      }
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsToDisplay.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(productsToDisplay.length / productsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (
      currentPage !== 1 &&
      totalPages === 0 &&
      productsToDisplay.length === 0
    ) {
      setCurrentPage(1);
    }
  }, [productsToDisplay, currentPage, totalPages]);

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
      if (i > 0 && i <= totalPages) pages.push(i);
    }
    if (end < totalPages && totalPages > 5) {
      if (end < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  if (formMode === "edit" || formMode === "add") {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white">
        <Navbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          authUser={authUser}
          roles={authUser ? authUser.tipe : null}
          fullName={authUser ? authUser.fullname : null}
          email={authUser ? authUser.email : null}
          logout={onLogoutHandler}
        />
        <div className="flex flex-1">
          <SidebarAdmin />
          <FormProductUser
            productData={formMode === "edit" ? productToEdit : null}
            onClose={handleCloseForm}
            onSave={handleSaveProduct}
            formMode={formMode}
            authUser={authUser}
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
        logout={onLogoutHandler}
      />
      <div className="flex flex-1 overflow-hidden">
        <SidebarAdmin />
        <main className="flex-1 p-5 overflow-y-auto">
          {/* ... (Struktur JSX untuk header "Produk Saya", tombol filter, dan tombol tambah produk tetap sama) ... */}
          <div className="flex flex-col gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-black text-2xl font-medium font-['Geist']">
                  Produk Saya
                </div>
                <div className="justify-start text-[#777777] text-base font-medium font-['Geist']">
                  Lihat dan kelola produk anda
                </div>
              </div>
              <div className="self-stretch inline-flex flex-wrap justify-between items-end gap-4">
                <div className="h-10 p-1 bg-[#F4F4F5] rounded-md flex justify-center items-center">
                  {" "}
                  <button
                    onClick={() => setActiveListingTab("On Listing")}
                    className={`h-8 px-3 py-1.5 rounded-sm flex justify-center items-center transition-colors cursor-pointer
                                        ${
                                          activeListingTab === "On Listing"
                                            ? "bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                                            : ""
                                        }`}
                  >
                    <div
                      className={`text-center justify-center text-base font-medium font-['Geist'] leading-normal transition-colors
                                        ${
                                          activeListingTab === "On Listing"
                                            ? "text-black"
                                            : "text-[#707079] hover:text-black/80"
                                        }`}
                    >
                      {" "}
                      On Listing
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveListingTab("Inactive")}
                    className={`h-8 px-3 py-1.5 rounded-sm flex justify-center items-center transition-colors cursor-pointer
                                        ${
                                          activeListingTab === "Inactive"
                                            ? "bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                                            : ""
                                        }`}
                  >
                    <div
                      className={`text-center justify-center text-base font-medium font-['Geist'] leading-normal transition-colors
                                        ${
                                          activeListingTab === "Inactive"
                                            ? "text-black"
                                            : "text-[#707079] hover:text-black/80"
                                        }`}
                    >
                      Inactive
                    </div>
                  </button>
                </div>
                <button
                  onClick={handleOpenAddForm}
                  className="pl-2 pr-3 py-2 bg-black rounded-lg outline-1 outline-offset-[-1px] outline-transparent hover:bg-black/90 flex justify-start items-center gap-2 overflow-hidden transition-colors cursor-pointer"
                >
                  <div className="size-6 relative flex justify-center items-center">
                    <Plus size={20} className="text-white" />{" "}
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="justify-start text-white text-base font-medium font-['Geist'] leading-normal">
                      Product
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="w-full flex flex-col justify-start items-start">
              <div className="self-stretch flex flex-col justify-start items-start">
                {/* Tabel Header */}
                <div className="self-stretch border-b border-[#E5E5E5] flex flex-col justify-start items-end gap-2.5 overflow-hidden">
                  <div className="self-stretch inline-flex justify-start items-center bg-gray-50">
                    <div className="w-[120px] h-14 max-w-36 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-sm sm:text-base font-medium font-['Geist'] leading-normal">
                        Gambar
                      </div>
                    </div>
                    <div className="flex-1 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-sm sm:text-base font-medium font-['Geist'] leading-normal">
                        Nama Barang
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-64 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-sm sm:text-base font-medium font-['Geist'] leading-normal">
                        Harga
                      </div>
                    </div>
                    <div className="w-24 h-14 max-w-[108px] border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-sm sm:text-base font-medium font-['Geist'] leading-normal">
                        Stok
                      </div>
                    </div>
                    <div className="flex-1 h-14 max-w-24 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center">
                      <div className="text-[#737373] text-sm sm:text-base font-medium font-['Geist'] leading-normal">
                        Sales
                      </div>
                    </div>
                    {(authUser?.tipe === "admin" ||
                      authUser?.tipe === "pegawai" ||
                      authUser?.tipe === "penitip") && (
                      <div className="flex-1 h-14 max-w-[120px] border-r border-neutral-200 flex justify-center items-center gap-2 px-2 text-center">
                        <div className="text-[#737373] text-sm sm:text-base font-medium font-['Geist'] leading-normal">
                          Aksi
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product List */}
                {isLoadingData ? (
                  <div className="w-full text-center py-10 text-gray-500">
                    Memuat data produk...
                  </div>
                ) : currentProducts.length === 0 ? (
                  <div className="w-full text-center py-10 text-gray-500">
                    {keyword
                      ? `Tidak ada produk yang cocok dengan "${keyword}".`
                      : "Tidak ada produk yang tersedia."}
                  </div>
                ) : (
                  currentProducts.map((item) => (
                    <div
                      key={item.id || `product-${Math.random()}`}
                      className="self-stretch border-b border-[#E5E5E5] inline-flex justify-start items-center min-h-[80px] hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-[120px] self-stretch max-w-36 p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                        <Image
                          className="size-16 rounded-lg object-cover"
                          src={item.image_url || "/placeholder-image.png"}
                          alt={item.name || "Gambar Produk"}
                          width={64}
                          height={64}
                        />
                      </div>
                      <div className="flex-1 self-stretch p-2 border-r border-[#E5E5E5] flex justify-start items-center">
                        <div className="flex-1 justify-start text-[#171717] text-sm sm:text-base font-medium font-['Geist'] leading-normal px-2">
                          {item.name || "Nama Tidak Ada"}
                        </div>
                      </div>
                      <div className="flex-1 self-stretch max-w-64 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div className="flex-1 text-center justify-start text-[#171717] text-sm sm:text-base font-medium font-['Geist'] leading-normal">
                          {formatRupiah(item.price)}
                        </div>
                      </div>
                      <div className="w-24 self-stretch max-w-[108px] p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div className="flex-1 text-center justify-start text-[#171717] text-sm sm:text-base font-medium font-['Geist'] leading-normal">
                          {item.stock !== null && item.stock !== undefined
                            ? item.stock
                            : "N/A"}
                        </div>
                      </div>
                      <div className="w-24 self-stretch max-w-[108px] p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                        <div className="flex-1 text-center justify-start text-[#171717] text-sm sm:text-base font-medium font-['Geist'] leading-normal">
                          {item.sales_count || 0}
                        </div>
                      </div>
                      {(authUser?.tipe === "admin" ||
                        authUser?.tipe === "pegawai" ||
                        (authUser?.tipe === "penitip" &&
                          item.user_id === authUser.id)) && (
                        <div className="flex-1 self-stretch max-w-[120px] p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                          <div className="flex justify-center items-center gap-2 sm:gap-4">
                            <button
                              onClick={() => handleOpenEditForm(item)}
                              aria-label={`Edit ${item.name}`}
                              className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                            >
                              <Image
                                src="/Pensil.svg"
                                alt="Edit"
                                width={20}
                                height={20}
                                className="w-4 h-4 sm:w-5 sm:h-5"
                              />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteProduct(item.id, item.name)
                              }
                              aria-label={`Hapus ${item.name}`}
                              className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                            >
                              <Image
                                src="/Trash.svg"
                                alt="Hapus"
                                width={20}
                                height={20}
                                className="w-4 h-4 sm:w-5 sm:h-5"
                              />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                    <div className="text-black text-lg font-medium">
                      Memproses...
                    </div>
                  </div>
                )}
              </div>
              {/* Paginasi */}
              {totalPages > 1 && !isLoadingData && (
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
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
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
          </div>
        </main>
      </div>
    </div>
  );
}
