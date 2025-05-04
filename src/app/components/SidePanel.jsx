"use client";
import { useState } from "react";

export default function SidePanel({ category }) {
  const [filterEnabled, setFilterEnabled] = useState(false);
  const categoryBox =
    "w-full py-2 px-2.5 rounded-md cursor-pointer hover:bg-[#E9ECF1] hover:text-[#199F48]";
  const unactiveCategoryBox = "bg-inherit text-[#666]";
  const activeCategoryBox = "bg-[#E9ECF1] text-[#199F48]";
  return (
    <aside className="w-[296px] min-h-screen fixed bg-[#F2F4F7] mx-5">
      <div
        id="category"
        className="m-2.5 grid gap-5 
      "
      >
        <span
          id="food"
          className={`${categoryBox} ${
            category === "food" ? activeCategoryBox : unactiveCategoryBox
          }`}
        >
          Makanan Berat
        </span>
        <span
          id="snack"
          className={`${categoryBox} ${
            category === "snack" ? activeCategoryBox : unactiveCategoryBox
          }`}
        >
          Makanan Ringan
        </span>
        <span
          id="drink"
          className={`${categoryBox} ${
            category === "drink" ? activeCategoryBox : unactiveCategoryBox
          }`}
        >
          Minuman
        </span>
      </div>
      <hr className="mx-5 text-[#D9DFE8] h-[10px] " />
      <div id="filter">
        <div className="mx-5">
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
      </div>
    </aside>
  );
}
