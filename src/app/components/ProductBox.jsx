import { useState } from "react";
import { PlusIcon } from "lucide-react";

export default function ProductBox({ id, name, price, stock, onClickFocus }) {
  const [isHover, setIsHover] = useState(false);
  return (
    <div className="w-[259px] h-fit rounded-lg border-1 border-[#d1d1d1] bg-white">
      <img
        src="image.png"
        alt="Pratinjau Produk"
        className="w-[259px] h-[194px] object-contain relative rounded-t-lg"
      />
      <div className="grid grid-cols-1 gap-4 px-4 mt-4">
        <div className="grid grid-cols-1 gap-2">
          <h5>{name}</h5>
          <p className="font-normal text-sm text-[#737373]">
            Diperoleh dan diolah dari kedelai pilihan
          </p>
          {/*Deskripsi */}
          <p className="font-normal text-sm text-[#737373]">Stok: {stock}</p>
          {/*Jumlah terjual */}
        </div>
        <div className="flex w-full  justify-between pb-4">
          <p className="font-medium text-base">
            Rp{" "}
            <span className="font-bold text-base">
              {price.toLocaleString("id-ID")}
            </span>
          </p>
          <div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className="inline-block cursor-pointer"
          >
            <div
              className={`flex items-center justify-around rounded-full h-8 w-20 transition-all duration-300 ease-in-out ${
                isHover ? "bg-[#199F48]" : "bg-inherit "
              }`}
            >
              <p
                className={`text-white font-medium mr-1 transition-opacity duration-300 ease-in-out ${
                  isHover ? "opacity-100" : "opacity-0 overflow-hidden"
                }`}
              >
                Beli
              </p>
              <PlusIcon
                stroke={!isHover ? "green" : "white"}
                onClick={() => onClickFocus(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
