// app/admin/products/page.jsx
'use client';

import FormProduct from "@/app/components/FormProduct";
import Kategori from "@/app/components/Kategori"; // Digunakan di tabel
import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
// Impor fungsi API untuk produk
// Hanya getProduct, updateProduct, dan deleteProduct yang digunakan
import { deleteProduct, getProduct, updateProduct } from "@/app/lib/api/product";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function ProductPage() {
    const [keyword, setKeyword] = useInput('');
    const [authUser, setAuthUser] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Untuk proses simpan/update/delete
    const [isLoadingData, setIsLoadingData] = useState(true); // Untuk loading data awal

    const [formMode, setFormMode] = useState(null); // Hanya akan 'edit' atau null
    const [productToEdit, setProductToEdit] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    async function onLogoutHandler() {
        await logout();
        setAuthUser(null);
    }

    function formatRupiah(angka) {
        if (angka === null || angka === undefined || angka === "") return "Rp. 0";
        const number = typeof angka === 'string' ? parseInt(angka.toString().replace(/[^0-9]/g, ""), 10) : angka;
        if (isNaN(number)) return "Rp. 0";
        return `Rp. ${number.toLocaleString('id-ID')}`;
    }

    const fetchProductsData = async () => {
        setIsLoadingData(true);
        const { error, data } = await getProduct();
        if (error) {
            console.error("Gagal mengambil data produk:", error);
            setAllProducts([]);
            // Using window.alert here as it's existing pattern in the code, though custom modals are generally preferred.
            window.alert("Gagal mengambil data produk. Silakan coba lagi.");
        } else {
            setAllProducts(Array.isArray(data) ? data : []);
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
            await fetchProductsData();
        };
        fetchInitialData();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!allProducts) return [];
        if (!keyword) {
            return allProducts;
        }
        const lowercasedKeyword = keyword.toLowerCase();
        return allProducts.filter(product =>
            product.name?.toLowerCase().includes(lowercasedKeyword) ||
            (product.category && product.category.name?.toLowerCase().includes(lowercasedKeyword)) ||
            (product.user && product.user.fullname?.toLowerCase().includes(lowercasedKeyword))
        );
    }, [allProducts, keyword]);


    const handleOpenEditForm = (product) => {
        setProductToEdit(product);
        setFormMode('edit');
    };

    const handleCloseForm = () => {
        setFormMode(null);
        setProductToEdit(null);
    };

    const handleSaveProduct = async (productDataFromForm) => {
        setIsLoading(true);
        let response;
        let successMessage = "";

        const payload = { ...productDataFromForm };

        if (formMode === 'edit' && payload.id) {
            console.log("Updating product with data:", payload);
            response = await updateProduct(payload);
            successMessage = "Produk berhasil diperbarui!";
        } else {
            console.error("Form mode tidak valid atau product ID tidak ada untuk edit.");
            // Using window.alert here as it's existing pattern in the code.
            window.alert("Terjadi kesalahan: Hanya mode edit yang didukung untuk penyimpanan.");
            setIsLoading(false);
            return;
        }

        setIsLoading(false);

        if (response && !response.error) { // Jika response.error adalah false atau null/undefined (sukses)
            // Using window.alert here as it's existing pattern in the code.
            window.alert(successMessage);
            handleCloseForm();
            await fetchProductsData();
        } else {
            // Penanganan error yang lebih baik
            let detailErrorMessage = "Terjadi kesalahan yang tidak diketahui.";
            if (response && response.error) {
                if (typeof response.error === 'string' && response.error.trim() !== "") {
                    detailErrorMessage = response.error;
                } else if (response.status) {
                    detailErrorMessage = `Gagal menyimpan produk. Status: ${response.status}. Silakan coba lagi atau hubungi administrator.`;
                } else {
                    detailErrorMessage = "Gagal menyimpan produk. Tidak ada detail tambahan dari server.";
                }
            }
            console.error("Gagal menyimpan produk:", response ? response : "Respons tidak diketahui");
            // Using window.alert here as it's existing pattern in the code.
            window.alert(detailErrorMessage);
        }
    };

    const handleDeleteProduct = async (productId, productName) => {
        // Using window.confirm here as it's existing pattern in the code.
        if (window.confirm(`Apakah Anda yakin ingin menghapus produk "${productName}"? Tindakan ini tidak dapat diurungkan.`)) {
            setIsLoading(true);
            const { error, status } = await deleteProduct(productId);
            setIsLoading(false);

            if (error) {
                let detailErrorMessage = `Gagal menghapus produk: ${productName}.`;
                if (typeof error === 'string' && error.trim() !== "") {
                    detailErrorMessage = error;
                } else if (status) {
                    detailErrorMessage = `Gagal menghapus produk. Status: ${status}.`;
                }
                console.error("Gagal menghapus produk:", error, "Status:", status);
                // Using window.alert here as it's existing pattern in the code.
                window.alert(detailErrorMessage);
            } else {
                // Using window.alert here as it's existing pattern in the code.
                window.alert(`Produk "${productName}" berhasil dihapus!`);
                await fetchProductsData();
            }
        }
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (totalPages === 0 && filteredProducts.length === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [filteredProducts, currentPage, totalPages]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
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
                pages.push('...');
            }
        }
        for (let i = start; i <= end; i++) {
            if (i > 0) pages.push(i);
        }
        if (end < totalPages && totalPages > 5) {
            if (end < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }
        return pages;
    };

    if (formMode === 'edit') {
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
                    <FormProduct
                        productData={productToEdit}
                        onClose={handleCloseForm}
                        onSave={handleSaveProduct}
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
            <div className="flex flex-1">
                <SidebarAdmin />
                <main className="flex-1 p-5 overflow-auto">
                    <div className="w-full">
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col gap-2">
                                    <div className="text-black text-2xl font-medium font-[Geist]">Data Barang</div>
                                    <div className="text-neutral-500 text-base font-medium font-[Geist]">Lihat rincian dari produk yang tersedia</div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="w-full border-b border-[#E5E5E5] flex flex-col justify-start items-start gap-2.5">
                                    <div className="self-stretch inline-flex justify-start items-center">
                                        <div className="w-24 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Gambar</div></div>
                                        <div className="flex-1 h-14 min-w-[150px] border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Nama Barang</div></div>
                                        <div className="flex-1 h-14 max-w-48 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Kategori</div></div>
                                        <div className="flex-1 h-14 max-w-32 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Harga</div></div>
                                        <div className="flex-1 h-14 max-w-28 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Stok</div></div>
                                        <div className="flex-1 h-14 max-w-32 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Penjual</div></div>
                                        <div className="w-24 h-14 border-r border-[#E5E5E5] flex justify-center items-center gap-2 px-2 text-center"><div className="text-[#737373] text-base font-medium font-['Geist'] leading-normal capitalize">Aksi</div></div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col">
                                    {isLoadingData ? (
                                        <div className="text-center py-8 text-gray-500">Memuat data produk...</div>
                                    ) : currentProducts.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            {keyword ? `Tidak ada produk yang cocok dengan "${keyword}".` : "Tidak ada produk yang tersedia."}
                                        </div>
                                    ) : (
                                        currentProducts.map((item) => (
                                            <div
                                                key={item.id}
                                                className="border-b border-[#E5E5E5] inline-flex justify-start items-center min-h-[80px]"
                                            >
                                                <div className="w-24 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                                                    {/* MODIFIED IMAGE HANDLING START */}
                                                    {item.image_url ? (
                                                        <Image
                                                            className="size-16 rounded-lg object-cover"
                                                            src={item.image_url}
                                                            alt={item.name || "Gambar Produk"}
                                                            width={64}
                                                            height={64}
                                                            onError={(e) => {
                                                                // Hide the image element if it fails to load
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        // Render an empty div to maintain layout if no image_url
                                                        <div className="size-16 rounded-lg bg-transparent"></div>
                                                    )}
                                                    {/* MODIFIED IMAGE HANDLING END */}
                                                </div>
                                                <div className="flex-1 self-stretch min-w-[150px] p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-sm md:text-base font-medium font-['Geist'] leading-normal">{item.name}</div></div>
                                                <div className="flex-1 self-stretch max-w-48 p-2 border-r border-[#E5E5E5] flex justify-center items-center">
                                                    <Kategori value={item.category?.name} />
                                                </div>
                                                <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-sm md:text-base font-medium font-['Geist'] leading-normal">{formatRupiah(item.price)}</div></div>
                                                <div className="flex-1 self-stretch max-w-28 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-sm md:text-base font-medium font-['Geist'] leading-normal">{item.stock}</div></div>
                                                <div className="flex-1 self-stretch max-w-32 p-2 border-r border-[#E5E5E5] flex justify-center items-center"><div className="flex-1 text-center text-black text-sm md:text-base font-medium font-['Geist'] leading-normal">{item.user?.fullname || 'N/A'}</div></div>
                                                <div className="w-24 self-stretch p-2 border-r border-[#E5E5E5] flex justify-center items-center gap-2">
                                                    <button onClick={() => handleDeleteProduct(item.id, item.name)} aria-label={`Hapus ${item.name}`} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                                                        <Image src="/Trash.svg" alt="Hapus" width={20} height={20} className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleOpenEditForm(item)} aria-label={`Edit ${item.name}`} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                                                        <Image src="/Pensil.svg" alt="Edit" width={20} height={20} className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {isLoading && (
                                        <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
                                            <div className="text-black text-lg font-medium">Memproses...</div>
                                        </div>
                                    )}
                                </div>
                                {totalPages > 1 && !isLoadingData && (
                                    <div className="w-full mt-6 flex justify-center items-center gap-2">
                                        <div className="flex justify-center items-center gap-1 sm:gap-2">
                                            <button
                                                onClick={prevPage}
                                                disabled={currentPage === 1}
                                                className="p-1 sm:size-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-50"
                                                aria-label="Halaman Sebelumnya"
                                            >
                                                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </button>
                                            {getPaginationGroup().map((pageItem, index) => (
                                                <div key={index}>
                                                    {pageItem === '...' ? (
                                                        <div className="text-gray-500 text-sm sm:text-base font-medium font-['Geist'] leading-normal px-1">...</div>
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
                                                disabled={currentPage === totalPages}
                                                className="p-1 sm:size-6 flex items-center justify-center rounded hover:bg-gray-200 transition disabled:opacity-50"
                                                aria-label="Halaman Berikutnya"
                                            >
                                                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 4L10 8L6 12" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
