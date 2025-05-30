'use client';

import Kategori from "@/app/components/Kategori";
import Navbar from "@/app/components/Navbar";
import SidebarAdmin from "@/app/components/SidebarAdmin";
import useInput from "@/app/hooks/useInput";
import { getUserLogged } from "@/app/lib/api/login";
import { logout } from "@/app/lib/api/logout";
import { getProduct } from "@/app/lib/api/product";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function ProductPage() {
    const [keyword, setKeyword] = useInput('');
    const [authUser, setAuthUser] = useState(null);

    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(8);

    useEffect(() => {
        const fetchUserAndProducts = async () => {
            const { error: userError, data: userData } = await getUserLogged();
            if (userError) {
                console.log("Token Invalid & Data user gagal terambil");
                // Anda mungkin ingin menambahkan router.push("/") di sini jika pengguna belum login
                return;
            }
            setAuthUser(userData);

            setIsLoadingProducts(true);
            const { error: productError, data: productsData } = await getProduct();
            if (productError) {
                console.error("Tidak dapat mengambil produk dari server:", productError);
                setAllProducts([]);
            } else {
                setAllProducts(productsData);
            }
            setIsLoadingProducts(false);
        };
        fetchUserAndProducts();
    }, []);

    async function onLogoutHandler() {
        await logout();
        setAuthUser(null);
    }

    const filteredProducts = useMemo(() => {
        let filtered = allProducts;

        if (authUser && authUser.id) {
            filtered = filtered.filter(product => product.user_id === authUser.id);
        }

        if (keyword) {
            const lowercasedKeyword = keyword.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(lowercasedKeyword) || // Menggunakan product.name
                (product.category && product.category.name.toLowerCase().includes(lowercasedKeyword)) || // Menggunakan product.category.name
                (product.user && product.user.fullname.toLowerCase().includes(lowercasedKeyword)) // Menggunakan product.user.fullname
            );
        }
        return filtered;
    }, [allProducts, authUser, keyword]);

    useEffect(() => {
        setProducts(filteredProducts);
        setCurrentPage(1);
    }, [filteredProducts]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(products.length / productsPerPage);

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

        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('...');
            }
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="w-full h-screen relative bg-white overflow-hidden flex flex-col">
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
            <div className="w-full flex flex-1">
                {/* Sidebar */}
                <SidebarAdmin />
                {/* Main Content */}
                <div className="flex-1 px-5 py-4 bg-white rounded-xl flex flex-col gap-12 overflow-auto">
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
                                    {isLoadingProducts ? (
                                        <div className="text-center py-4 text-gray-500">Loading products...</div>
                                    ) : currentProducts.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500">No products found for this user.</div>
                                    ) : (
                                        currentProducts.map((item, idx) => (
                                            <div key={item.id || idx} className="border-b border-neutral-200 flex items-center">
                                                <div className="w-full self-stretch max-w-[10%] p-2 border-r border-neutral-200 flex justify-center items-center">
                                                    {/* Menggunakan item.image_url */}
                                                    <Image 
                                                        className="size-16 rounded-lg object-cover" 
                                                        src={item.image_url || `/placeholder-image.png`} // Fallback image jika null
                                                        alt={item.name || 'Product Image'} 
                                                        width={64} 
                                                        height={64}
                                                    />
                                                </div>
                                                <div className="w-full self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                                                    <div className="flex-1 text-black text-base font-medium font-[Geist] leading-normal">{item.name}</div> {/* Menggunakan item.name */}
                                                </div>
                                                <div className="w-full max-w-[15%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                                                    <Kategori value={item.category ? item.category.name : 'N/A'} /> {/* Menggunakan item.category.name */}
                                                </div>
                                                <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                                                    <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">Rp. {item.price ? item.price.toLocaleString('id-ID') : '0'}</div> {/* Menggunakan item.price */}
                                                </div>
                                                <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                                                    <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.stock}</div> {/* Menggunakan item.stock */}
                                                </div>
                                                <div className="w-full max-w-[15%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                                                    <div className="flex-1 text-center text-black text-base font-medium font-[Geist] leading-normal">{item.user ? item.user.fullname : 'N/A'}</div> {/* Menggunakan item.user.fullname */}
                                                </div>
                                                <div className="w-full max-w-[10%] self-stretch p-2 border-r border-neutral-200 flex justify-center items-center">
                                                    <div className="flex gap-4">
                                                        {/* Icon Trash (kiri) */}
                                                        <button className="size-6 flex items-center justify-center" aria-label="Delete">
                                                            <img src="/trash.svg" alt="Delete" className="size-5" />
                                                        </button>
                                                        {/* Icon Edit (kanan) */}
                                                        <button className="size-6 flex items-center justify-center" aria-label="Edit">
                                                            <img src="/pensil.svg" alt="Edit" className="size-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="w-full flex justify-center items-center gap-2 mt-4 mx-auto">
                                        <div className="flex items-center gap-2">
                                            {/* Left Arrow */}
                                            <button
                                                onClick={prevPage}
                                                disabled={currentPage === 1}
                                                className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                                                aria-label="Previous Page"
                                            >
                                                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                    <path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                            {getPaginationGroup().map((item, index) => (
                                                <div key={index}>
                                                    {item === '...' ? (
                                                        <div className="text-gray-500 text-base font-medium font-[Geist] leading-normal">...</div>
                                                    ) : (
                                                        <button
                                                            onClick={() => paginate(item)}
                                                            className={`size-6 flex items-center justify-center rounded transition ${
                                                                currentPage === item
                                                                    ? "bg-gray-300 text-black"
                                                                    : "hover:bg-gray-200 text-gray-500"
                                                            }`}
                                                        >
                                                            <div className="text-base font-medium font-[Geist] leading-normal">{item}</div>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {/* Right Arrow */}
                                            <button
                                                onClick={nextPage}
                                                disabled={currentPage === totalPages}
                                                className="size-6 flex items-center justify-center rounded hover:bg-gray-200 transition"
                                                aria-label="Next Page"
                                            >
                                                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                    <path d="M6 4L10 8L6 12" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
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
