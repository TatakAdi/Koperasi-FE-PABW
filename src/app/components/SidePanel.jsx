"use client";
import { useState } from "react";
import { Hamburger, Popcorn, Coffee, List } from "lucide-react";

export default function SidePanel({
  category,
  onCategoryChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  salesSort,
  setSalesSort,
}) {
  const [filterEnabled, setFilterEnabled] = useState(false);
  const categoryBox =
    "flex gap-1.5 w-full py-2 px-2.5 rounded-md cursor-pointer hover:bg-[#E9ECF1] hover:text-[#199F48]";
  const unactiveCategoryBox = "bg-inherit text-[#666]";
  const activeCategoryBox = "bg-[#E9ECF1] text-[#199F48]";

  return (
    <aside className="w-[296px] min-h-screen bg-[#F2F4F7] sticky top-0 h-full">
      <div id="OrderOrderISay" className="m-2.5">
        <div
          id="Order"
          className={`${categoryBox} ${
            category === "Makanan Berat"
              ? activeCategoryBox
              : unactiveCategoryBox
          }`}
        >
          <List size={20} />
          <span>My Order</span>
        </div>
      </div>
      <hr className="mx-5 text-[#D9DFE8] h-[10px] " />
      <div id="category" className="m-2.5 grid gap-5 flex-shrink-0">
        <div
          id="food"
          onClick={() => onCategoryChange("Makanan Berat")}
          className={`${categoryBox} ${
            category === "Makanan Berat"
              ? activeCategoryBox
              : unactiveCategoryBox
          }`}
        >
          <Hamburger size={20} />
          <span>Makanan Berat</span>
        </div>
        <div
          id="snack"
          onClick={() => onCategoryChange("Makanan Ringan")}
          className={`${categoryBox} ${
            category === "Makanan Ringan"
              ? activeCategoryBox
              : unactiveCategoryBox
          }`}
        >
          <Popcorn size={20} />
          <span>Makanan Ringan</span>
        </div>
        <div
          id="drink"
          onClick={() => onCategoryChange("Minuman")}
          className={`${categoryBox} ${
            category === "Minuman" ? activeCategoryBox : unactiveCategoryBox
          }`}
        >
          <Coffee size={20} />
          <span>Minuman</span>
        </div>
      </div>
      <hr className="mx-5 text-[#D9DFE8] h-[10px] " />
      <div id="filter">
        <div className="mx-5 my-3">
          <label className="flex justify-between items-center">
            <span>Terapkan filter</span>
            <div className="relative cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={filterEnabled}
                onChange={() => setFilterEnabled(!filterEnabled)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-all duration-300"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-full" />
            </div>
          </label>
        </div>

        <div
          className={`mx-5 transition-opacity duration-700 ease-in-out ${
            filterEnabled ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="mb-4">
            <p className="font-semibold text-sm text-black mb-2">
              Jumlah Penjualan
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-[#666]">
                <input
                  type="radio"
                  name="sales"
                  value="Terbanyak"
                  checked={salesSort === "Terbanyak"}
                  onChange={() => setSalesSort("Terbanyak")}
                />
                Terbanyak
              </label>
              <label className="flex items-center gap-2 text-sm text-[#666]">
                <input
                  type="radio"
                  name="sales"
                  value="Tersedikit"
                  checked={salesSort === "Tersedikit"}
                  onChange={() => setSalesSort("Tersedikit")}
                />
                Tersedikit
              </label>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm text-black mb-2">Harga</p>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Rp. MIN"
                value={minPrice}
                onChange={onMinPriceChange}
                className="w-full px-2 py-1 border rounded text-sm"
              />
              <span className="self-center text-gray-500">–</span>
              <input
                type="number"
                placeholder="Rp. MAX"
                value={maxPrice}
                onChange={onMaxPriceChange}
                className="w-full px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
