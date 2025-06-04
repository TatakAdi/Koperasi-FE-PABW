"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductBox from "./components/ProductBox";
import ProductFocusBox from "./components/ProductFocusBox";
import SidePanel from "./components/SidePanel";
import useInput from "./hooks/useInput";
import { addCartItem } from "./lib/api/cart";
import { getUserLogged } from "./lib/api/login";
import { logout } from "./lib/api/logout";
import { getProduct, getProductId } from "./lib/api/product";

export default function Home() {
  const [authUser, setAuthUser] = useState(null);
  const [category, setCategory] = useState(null); // Kategori : "food","Snack","drink"
  const [produk, setProduk] = useState([]);
  const [productItem, SetProductItem] = useState([]);
  const [minPrice, setMinPrice] = useInput();
  const [maxPrice, setMaxPrice] = useInput();
  const [keyword, setKeyword] = useInput();
  const [sellSort, setSellSort] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Untuk Daftar Produk
  const [isAddCartLoad, setIsAddCartLoad] = useState(false);
  const [isProductLoad, setIsProductLoad] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedProduct, setSelectedProduk] = useState(null);
  const [jumlah, onJumlahChange] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false); // Untuk notifikasi barang berhasil ke keranjang atau tidak
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }

  const onPlusOrder = () => {
    return onJumlahChange((prevState) =>
      Math.min(prevState + 1, productItem.stock)
    );
  };

  const onMinOrder = () => {
    return onJumlahChange((prevState) => Math.max(prevState - 1, 1));
  };

  const onCategoryChange = (selectedCategory) => {
    if (category === selectedCategory) {
      setCategory(null);
    } else {
      setCategory(selectedCategory);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await getUserLogged();

      if (error) {
        console.log("Token Invalid & Data user gagal terambil");
        return;
      }

      console.log("Data pengguna :", data);
      setAuthUser(data);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchProduk = async () => {
      setIsLoading(true);
      const { error, data } = await getProduct();

      if (error) {
        console.error("Tidak dapat mengambil produk dari server");
        setIsLoading(false);
        return;
      }
      console.log(data);
      setProduk(data);
      setIsLoading(false);
    };
    fetchProduk();
  }, []);

  useEffect(() => {
    const productDetail = async () => {
      setIsProductLoad(true);
      if (!selectedProduct) return;

      const { error, data } = await getProductId(selectedProduct);

      if (error) {
        console.error("Gagal mengambil detail produk yang dipilih");
        return;
      }
      SetProductItem(data);
      setIsProductLoad(false);
    };
    productDetail();
  }, [selectedProduct]);

  const addCartItemHandler = async () => {
    setIsAddCartLoad(true);
    const { error, data } = await addCartItem(authUser.id, selectedProduct, {
      jumlah,
    });

    if (!authUser.id) {
      setSuccessMessage("Maaf,anda belum login");
      console.error("Pengguna belum melakukan login");
    }

    if (error) {
      console.error("Gagal menambahkan produk ke dalam keranjang");
      setSuccessMessage("Maaf,produk gagal ditambahkan ke dalam keranjang");
    }
    setIsAddCartLoad(false);
    setIsSuccess(true);
    setSuccessMessage("Barang berhasil ditambahkan ke keranjang");

    setTimeout(() => {
      setIsSuccess(false);
      setSuccessMessage("");
      setIsFocus(false);
    }, 2500);
  };

  const filteredContent = () => {
    const categoryMap = {
      "Makanan Berat": 1,
      "Makanan Ringan": 2,
      Minuman: 3,
    };

    let result = [...produk];

    if (category && categoryMap[category]) {
      result = result.filter(
        (item) => item.category_id === categoryMap[category]
      );
    }

    const min =
      isNaN(Number(minPrice)) || minPrice == "" ? 0 : Number(minPrice);
    const max =
      isNaN(Number(maxPrice)) || maxPrice == "" ? Infinity : Number(maxPrice);
    result = result.filter((item) => item.price >= min && item.price <= max);

    if (keyword && keyword.trim() !== "") {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    const validSort = sellSort === "Terbanyak" || sellSort === "Tersedikit";
    if (validSort) {
      result = result.sort((a, b) =>
        sellSort === "Terbanyak" ? b.stock - a.stock : a.stock - b.stock
      );
    }

    return result;
  };

  return (
    <div className="min-h-screen h-screen w-full font-[family-name:var(--font-geist-sans)] overflow-y-hidden">
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
        className={`flex flex-col lg:flex-row mx-5 gap-4 ${
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
        <div className="w-full overflow-y-auto h-full">
          <p className="h-5 my-4">
            {!category ? (
              <>Semua Produk ({filteredContent().length})</>
            ) : (
              <>
                Semua Produk &gt; {category}({filteredContent().length})
              </>
            )}
          </p>
          {!isLoading ? (
            filteredContent().length !== 0 ? (
              <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                {filteredContent().map((produk) => (
                  <ProductBox
                    key={produk.id}
                    id={produk.id}
                    name={produk.name}
                    price={produk.price}
                    deskripsi={produk.description}
                    stock={produk.stock}
                    imageUrl={produk.image_url}
                    onClickFocus={(focus) => {
                      setSelectedProduk(produk.id);
                      setIsFocus(focus);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <p className="text-xl text-gray-500">
                  Maaf, barang tidak dapat ditemukan
                </p>
              </div>
            )
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-full">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black"></div>
              <p className="text-xl">Mohon Tunggu Sebentar</p>
            </div>
          )}
        </div>
      </main>
      {isFocus && (
        <ProductFocusBox
          key={productItem.id}
          name={productItem.name}
          stock={productItem.stock}
          order={jumlah}
          addCartItem={addCartItemHandler}
          onChangeorder={(e) => onJumlahChange(Number(e.target.value))}
          onResetValue={() => onJumlahChange(1)}
          onPlusOrder={onPlusOrder}
          onMinOrder={onMinOrder}
          onFocusChange={setIsFocus}
          productDataLoad={isProductLoad}
          addCartItemLoad={isAddCartLoad}
          isSucced={isSuccess}
          succedMessage={successMessage}
          imageUrl={productItem.image_url}
        />
      )}
    </div>
  );
}
