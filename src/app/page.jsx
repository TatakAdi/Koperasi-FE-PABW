"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import { getUserLogged } from "./lib/api/login";
import { useEffect, useState } from "react";
import produkData from "../../data/dummyProduk.json";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidePanel from "./components/SidePanel";
import useInput from "./hooks/useInput";
import ProductBox from "./components/ProductBox";

export default function Home() {
  const [authUser, setAuthUser] = useState(null);
  const [category, setCategory] = useState("food"); // Kategori : "food","Snack","drink"
  const [produk, setProduk] = useState([]);
  const [minPrice, setMinPrice] = useInput();
  const [maxPrice, setMaxPrice] = useInput();
  const [sellSort, setSellSort] = useState("Terbanyak");
  const [keyword, setKeyword] = useInput();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await getUserLogged();

      if (error) {
        console.log("Token Invalid & Data user gagal terambil");
        return;
      }

      console.log("Data pengguna :", data);
      setAuthUser(data);
      router.push("/Welcome");
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchProduk = async () => {
      const res = await fetch("/dummyProduk.json");
      const data = await res.json();
      setProduk(data);
    };
    fetchProduk();
  }, []);

  // if (authUser !== null) {
  //   router.push("/Welcome");
  // }

  const filteredContent = () => {
    const categoryMap = {
      food: 1,
      snack: 2,
      drink: 3,
    };

    return produkData
      .filter((item) => item.category_id === categoryMap[category])
      .filter((item) => {
        const min = minPrice || 0;
        const max = maxPrice || Infinity;
        return item.price >= min && item.price <= max;
      })
      .filter((item) => item.name.toLowerCase().includes(keyword.toLowerCase()))
      .sort((a, b) =>
        sellSort === "Terbanyak" ? b.stock - a.stock : a.stock - b.stock
      );
  };

  return (
    <div className="min-h-screen w-full font-[family-name:var(--font-geist-sans)] ">
      <Navbar keyword={keyword} onKeywordCahnge={setKeyword} />
      <main className=" flex mx-5 gap-4">
        <SidePanel
          category={category}
          onCategoryChange={setCategory}
          salesSort={sellSort}
          setSalesSort={setSellSort}
          maxPrice={maxPrice}
          minPrice={minPrice}
          onMaxPriceChange={setMaxPrice}
          onMinPriceChange={setMinPrice}
        />
        <div className="flex-grow">
          <p className="h-5 my-4">Minuman {">"} Minuman(19)</p>
          <div className="flex-grow grid grid-cols-4 gap-4  ">
            {filteredContent().map((produk) => (
              <ProductBox
                key={produk.id}
                name={produk.name}
                price={produk.price}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
