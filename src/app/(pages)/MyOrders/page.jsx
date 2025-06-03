"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserLogged } from "app/lib/api/login";
import { logout } from "app/lib/api/logout";
import { getCartItems } from "app/lib/api/cart";
import { checkout } from "@/app/lib/api/checkout";
import { cartHistory } from "@/app/lib/api/cartHistory";
import useInput from "app/hooks/useInput";
import CheckoutCard from "app/components/keranjang/CheckoutCard";
import Navbar from "app/components/Navbar";
import SidePanel from "app/components/SidePanel";
import MyOrderNotPayItems from "app/components/myOrders/MyOrderNotPayItems";
import OnProcessedItem from "@/app/components/myOrders/OnProcessedItem";

export default function MyOrders() {
  const [authUser, setAuthUser] = useState(null);
  const [category, setCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartItems, setCartItems] = useState([]); // Cart yang belum dibayar
  const [buyedItems, setBuyedItems] = useState([]); // Cart yang sudah dibayar + lagi diproses
  const [processedItems, setProcessedItems] = useState([]);
  const [status, setStatus] = useState("Belum Dibayar"); // "Belum Dibayar", "Sedang Diproses", "Sedang Dikirim", "Selesai"
  const [minPrice, setMinPrice] = useInput();
  const [maxPrice, setMaxPrice] = useInput();
  const [keyword, setKeyword] = useInput();
  const [sellSort, setSellSort] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Untuk notifikasi barang berhasil ke keranjang atau tidak
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await getUserLogged();

      if (error) {
        console.log("Token Invalid & Data user gagal terambil");
        return;
      }

      setAuthUser(data);

      const cartRes = await getCartItems(data.id);
      const payedCartRes = await cartHistory(data.id);
      console.log("CartRes: ", cartRes);
      console.log("payedCartRes: ", payedCartRes);
      setCart(cartRes.data);
      if (!cartRes.error && cartRes.data && cartRes.data.items) {
        const items = cartRes.data.items.map((item) => ({
          ...item,
          quantity: item.jumlah,
        }));
        setCartItems(items);
        setProducts(items);
      }
      // Masalah di sini wak
      if (!payedCartRes.error && payedCartRes.data && payedCartRes.data.carts) {
        const carts = payedCartRes.data.carts.map((item) => ({
          ...item,
        }));
        // const items = carts.items.map((item) => ({
        //   ...item,
        // }));
        setBuyedItems(carts);

        const mergedItems = carts.flatMap((cart) =>
          (cart.items || []).map((item) => ({
            ...item,
            cart_id: cart.cart_id,
            status_barang: cart.status_barang,
            sudah_bayar: cart.sudah_bayar,
            total_harga: cart.total_harga,
          }))
        );

        console.log("gabungan item : ", mergedItems);
        setProcessedItems(mergedItems);
      }
    };
    getUser();
    console.log("cart = ", cart);
  }, []);

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  const onCategoryChange = (selectedCategory) => {
    if (category === selectedCategory) {
      setCategory(null);
    } else {
      setCategory(selectedCategory);
    }
  };

  // Masih uji coba
  const notPayedCartItem = () => {
    if (cart && cart.status_barang === "menunggu pegawai") {
      const filteredContent = cart.items || [];
      console.log("filtered: ", filteredContent);
      return filteredContent;
    }
    console.log("filtered: [] (cart tidak sedang menunggu pegawai)");
    return [];
  };

  const onProcessedCartItem = () => {
    console.log("Processed Items: ", processedItems);
    if (processedItems) {
      const filteredContent = processedItems.filter(
        (item) => item.status_barang === "akan dikirim"
      );
      console.log("filtered: ", filteredContent);
      return filteredContent;
    }
    console.log("Gagal memfilter cart yang akan dikirim");
    return [];
  };

  const onPayHandle = (itemId) => {
    const selectedItem = cartItems.find((item) => item.id === itemId);
    if (selectedItem) {
      setSelectedItems([itemId]);
      setTotal(selectedItem.subtotal);
      console.log("Products: ", products);
      setIsFocus(true);
    }
    console.log("Selecteditem =", selectedItems);
    console.log("cart: ", cart);
    console.log("buyed cart = ", buyedItems);
    console.log("processed Items: ", processedItems);
  };

  const onCheckoutHandle = async ({ items, payment_method }) => {
    if (!cart || selectedItems.length === 0) return;

    // const itemToPay = cartItems
    //   .filter((item) => selectedItems.includes(item.id))
    //   .map((item) => ({ product_id: item.product_id, jumlah: item.quantity }));

    const { error, data } = await checkout({
      cart_id: cart.cart_id,
      items,
      payment_method,
    });

    if (error) {
      console.error("Gagal melakukan pembayaran, error: ", error);
      return;
    }

    console.log("checkout berhasil dilakukan: ", data.message);
    setIsFocus(false);
    sessionStorage.removeItem("payment_method");
    router.refresh();
  };

  return (
    <div className="min-h-screen h-screen w-full font-[family-name:var(--font-geist-sans)]  overflow-y-hidden">
      <Navbar
        keyword={keyword}
        onKeywordChange={setKeyword}
        authUser={authUser}
        roles={authUser !== null && authUser.tipe}
        fullName={authUser !== null && authUser.fullname}
        email={authUser !== null && authUser.email}
        saldo={authUser !== null && authUser.saldo}
        logout={onLogoutHandler}
      />
      <main
        className={`flex mx-5 gap-4 ${
          isFocus ? "-z-10" : "z-0"
        } overflow-hidden h-[calc(100vh-88px)]`}
      >
        <SidePanel
          category={category}
          onCategoryChange={onCategoryChange}
          salesSort={sellSort}
          setSalesSort={setSellSort}
          maxPrice={maxPrice}
          minPrice={minPrice}
          onMaxPriceChange={setMaxPrice}
          onMinPriceChange={setMinPrice}
        />
        <div className="flex-grow h-full">
          <div
            className={`flex w-full text-[#969696] gap-8 cursor-pointer mb-5`}
          >
            <span
              className={`${
                status === "Belum Dibayar" &&
                "text-black underline underline-offset-4"
              } hover:text-black`}
              onClick={() => setStatus("Belum Dibayar")}
            >
              Belum Dibayar
            </span>
            <span
              className={`${
                status === "Sedang Diproses" &&
                "text-black underline underline-offset-4"
              } hover:text-black`}
              onClick={() => setStatus("Sedang Diproses")}
            >
              Sedang Diproses
            </span>
            <span
              className={`${
                status === "Sedang Dikirim" &&
                "text-black underline underline-offset-4"
              } hover:text-black`}
              onClick={() => setStatus("Sedang Dikirim")}
            >
              Sedang Dikirim
            </span>
            <span
              className={`${
                status === "Selesai" &&
                "text-black underline underline-offset-4"
              } hover:text-black`}
              onClick={() => setStatus("Selesai")}
            >
              Selesai
            </span>
          </div>

          {status === "Belum Dibayar" && (
            <>
              <div className="grid grid-cols-4 items-center text-center text-[#737373] border-[#E5E5E5] border-b-1">
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Nama Barang
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Harga
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Jumlah
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Aksi
                </div>
              </div>

              <div className="divide-y">
                {notPayedCartItem().map((item) => (
                  <MyOrderNotPayItems
                    key={item.id}
                    {...item}
                    onPayHandle={onPayHandle}
                  />
                ))}
              </div>
              {/*Tempat MyOrdersCartItem ditaruh nanti */}
            </>
          )}
          {status === "Sedang Diproses" && (
            <>
              <div className="grid grid-cols-3 items-center text-center text-[#737373] border-[#E5E5E5] border-b-1">
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Nama Barang
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Harga
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Jumlah
                </div>
              </div>

              <div className="divide-y">
                {onProcessedCartItem().map((item) => (
                  <OnProcessedItem key={item.id} {...item} />
                ))}
              </div>
            </>
          )}
          {status === "Sedang Dikirim" && (
            <>
              <div className="grid grid-cols-4 items-center text-center text-[#737373] border-[#E5E5E5] border-b-1">
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Nama Barang
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Harga
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Jumlah
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  status
                </div>
              </div>
            </>
          )}
          {status === "Selesai" && (
            <>
              <div className="grid grid-cols-5 items-center text-center text-[#737373] border-[#E5E5E5] border-b-1">
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Nama Barang
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Harga
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Jumlah
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Status
                </div>
                <div className="text-lg py-6 border-r-1 border-[#E5E5E5]">
                  Aksi
                </div>
              </div>
            </>
          )}
        </div>

        {isFocus && (
          <CheckoutCard
            total={total}
            products={products}
            selectedItems={selectedItems}
            onCancel={() => setIsFocus(false)}
            onSubmitCheckout={onCheckoutHandle}
          />
        )}
      </main>
    </div>
  );
}
