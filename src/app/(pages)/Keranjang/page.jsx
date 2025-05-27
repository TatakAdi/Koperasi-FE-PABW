"use client";
import Navbar from "app/components/Navbar";
import SidePanel from "app/components/SidePanel";
import CheckoutCard from "app/components/keranjang/CheckoutCard";
import { deleteCartItem, getCartItems, updateCartItem } from "app/lib/api/cart";
import { getUserLogged } from "app/lib/api/login";
import { logout } from "app/lib/api/logout";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function KeranjangPage() {
  const [authUser, setAuthUser] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const updateTimeout = useRef({});

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await getUserLogged();
      if (error) return;
      setAuthUser(data);

      const cartRes = await getCartItems(data.id);
      console.log("cartRes", cartRes); // Tambahkan ini
      if (!cartRes.error && cartRes.data && cartRes.data.items) {
        setProducts(
          cartRes.data.items.map((item) => ({
            ...item,
            quantity: item.jumlah,
          }))
        );
      }
    };
    getUser();
  }, []);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  const selectedFiltered = products.filter((item) =>
    selectedItems.includes(item.id)
  );

  const total = selectedFiltered.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const hasSelectedItems = selectedItems.length > 0;

  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleQuantityChange = (id, delta) => {
    setProducts((prev) => {
      const updated = prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );

      // Debounce update ke backend
      if (updateTimeout.current[id]) {
        clearTimeout(updateTimeout.current[id]);
      }

      // Ambil quantity terbaru dari hasil update
      const newQuantity = updated.find((item) => item.id === id)?.quantity;

      updateTimeout.current[id] = setTimeout(async () => {
        if (!authUser) return;
        await updateCartItem(authUser.id, id, { jumlah: newQuantity });
      }, 700);

      return updated;
    });
  };

  const handleSelectAll = () => {
    const idsInView = products.map((p) => p.id);
    const isAllSelected = idsInView.every((id) => selectedItems.includes(id));
    if (isAllSelected) {
      setSelectedItems((prev) => prev.filter((id) => !idsInView.includes(id)));
    } else {
      setSelectedItems((prev) => [...new Set([...prev, ...idsInView])]);
    }
  };

  const handleClearSelection = async () => {
    // Hapus semua produk yang terseleksi satu per satu
    for (const id of selectedItems) {
      await handleDelete(id);
    }
    setSelectedItems([]);
  };

  const handleDelete = async (id) => {
    if (!authUser) return;
    const { error } = await deleteCartItem(authUser.id, id);
    if (!error) {
      setProducts((prev) => prev.filter((item) => item.id !== id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    } else {
      alert("Gagal menghapus produk dari keranjang!");
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar
        keyword={searchTerm}
        onKeywordCahnge={setSearchTerm}
        authUser={authUser}
        roles={authUser !== null && authUser.tipe}
        logout={onLogoutHandler}
      />
      <div className="flex">
        <SidePanel />
        <main className="flex-1 bg-white flex flex-col items-start">
          <section className="w-[1124px] min-h-[932px] px-5 py-4 bg-white rounded-xl inline-flex flex-col justify-start items-start gap-4 overflow-hidden mt-8">
            <div className="inline-flex justify-start items-start gap-4">
              <div className="text-base font-medium text-[#222] font-['Geist'] leading-tight">
                Keranjang Anda
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-start items-start gap-12">
              <div className="flex flex-col justify-start items-start">
                <div className="w-[1084px] h-14 relative border-b border-[#e5e7eb] overflow-hidden">
                  <div className="w-[1084px] max-w-[1084px] left-0 top-0 absolute inline-flex justify-start items-center">
                    <div className="w-[360px] h-14 min-w-80 border-r border-[#e5e7eb] flex justify-start items-center gap-[106px]">
                      <div className="w-6 h-6" />
                      <div className="text-base font-medium text-[#737373] font-['Geist'] leading-normal">
                        Nama Barang
                      </div>
                    </div>
                    <div className="flex-1 h-14 border-r border-[#e5e7eb] flex justify-center items-center">
                      <div className="text-base font-medium text-[#737373] font-['Geist'] leading-normal">
                        Harga
                      </div>
                    </div>
                    <div className="flex-1 h-14 border-r border-[#e5e7eb] flex justify-center items-center">
                      <div className="text-base font-medium text-[#737373] font-['Geist'] leading-normal">
                        Jumlah
                      </div>
                    </div>
                    <div className="w-[200px] h-14 border-r border-[#e5e7eb] flex justify-center items-center gap-4">
                      <div className="text-base font-medium text-[#737373] font-['Geist'] leading-normal">
                        Aksi
                      </div>
                    </div>
                  </div>
                </div>
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`w-[1084px] h-[120px] relative border-b border-[#e5e7eb] flex items-center ${
                      selectedItems.includes(product.id) ? "bg-[#e6f7ec]" : ""
                    }`}
                  >
                    <div className="w-[360px] min-w-80 min-h-[120px] py-7 border-r border-[#e5e7eb] flex items-center gap-4">
                      <img
                        src={
                          selectedItems.includes(product.id)
                            ? "/checked_box.svg"
                            : "/unchecked_box.svg"
                        }
                        alt={
                          selectedItems.includes(product.id)
                            ? "Checked"
                            : "Unchecked"
                        }
                        className="w-6 h-6 cursor-pointer"
                        onClick={() => handleSelect(product.id)}
                      />
                      <div className="flex items-center gap-4">
                        <img
                          className="w-16 h-16 rounded-lg"
                          src={product.image}
                          alt={product.name}
                        />
                        <div className="flex flex-col gap-1">
                          <div className="text-base font-medium text-neutral-900 font-['Geist'] leading-tight">
                            {product.name}
                          </div>
                          <div className="text-sm text-[#999] font-normal font-['Geist'] leading-tight">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
                      <div className="text-base font-medium text-[#222] font-['Geist']">
                        Rp. {product.price.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex justify-center items-center gap-3">
                      <img
                        src="/minus.svg"
                        alt="Kurangi"
                        className={`w-6 h-6 cursor-pointer ${
                          product.quantity <= 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() =>
                          product.quantity > 1 &&
                          handleQuantityChange(product.id, -1)
                        }
                        style={{
                          pointerEvents:
                            product.quantity <= 1 ? "none" : "auto",
                        }}
                      />
                      <div className="w-8 text-center text-base text-neutral-900">
                        {product.quantity}
                      </div>
                      <img
                        src="/plus.svg"
                        alt="Tambah"
                        className={`w-6 h-6 cursor-pointer ${
                          product.quantity >=
                          (product.stock ?? product.stok ?? 99)
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() =>
                          product.quantity <
                            (product.stock ?? product.stok ?? 99) &&
                          handleQuantityChange(product.id, 1)
                        }
                      />
                    </div>
                    <div className="w-[200px] h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
                      <button
                        className="text-base font-medium text-[#e74c3c] font-['Geist'] cursor-pointer"
                        onClick={() => handleDelete(product.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {hasSelectedItems && (
                <div className="w-[1084px] h-12 flex items-center">
                  <div className="w-[360px] min-w-80 h-12 border-r border-[#e5e7eb] flex items-center gap-[106px]">
                    <img
                      src={
                        products.length > 0 &&
                        products.every((p) => selectedItems.includes(p.id))
                          ? "/checked_box.svg"
                          : "/unchecked_box.svg"
                      }
                      alt="Pilih Semua"
                      className="w-6 h-6 cursor-pointer"
                      onClick={handleSelectAll}
                    />
                    <div className="text-base font-medium text-[#222] font-['Geist']">
                      Pilih Semua ({products.length})
                    </div>
                  </div>
                  <div className="w-[262px] h-12 px-4 border-r border-[#e5e7eb] flex items-center justify-center">
                    <button
                      className="text-base font-medium text-[#e74c3c] font-['Geist'] cursor-pointer"
                      onClick={handleClearSelection}
                    >
                      Hapus Seleksi
                    </button>
                  </div>
                  <div className="w-[262px] h-12 flex items-center justify-center">
                    <div>
                      <span className="text-base font-normal text-[#222] font-['Geist']">
                        Total ({selectedFiltered.length} Produk):
                      </span>
                      <br />
                      <span className="text-xl font-semibold text-[#222] font-['Geist']">
                        Rp. {total.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <div className="w-[200px] h-12 flex items-center justify-center">
                    <button
                      className="w-full h-10 bg-[#189e48] rounded-lg text-white font-medium font-['Geist'] cursor-pointer"
                      onClick={() => setShowCheckout(true)}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {showCheckout && (
        <CheckoutCard
          total={total}
          products={products}
          selectedItems={selectedItems}
          onCancel={() => setShowCheckout(false)}
          onContinue={(type) => {
            alert(`Pesanan dengan tipe: ${type} berhasil!`);
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
}
