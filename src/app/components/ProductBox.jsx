import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function ProductBox({
  id,
  name,
  price,
  stock,
  onClickFocus,
  deskripsi,
  imageUrl,
}) {
  const [isHover, setIsHover] = useState(false);

  const pangkasDeskripsi = (text, maxLength) => {
    if (typeof text !== "string") return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="w-[259px] h-fit rounded-lg border-1 border-[#d1d1d1] bg-white">
      <img
        src={imageUrl ? imageUrl.replace('local:', '/') : '/image.png'}
        alt="Pratinjau Produk"
        className="w-[257px] h-[190px] object-cover relative rounded-t-lg items-center justify-center"
      />
      <div className="grid grid-cols-1 gap-4 px-4 mt-4">
        <div className="grid grid-cols-1 gap-2">
          <h5 className="font-medium text-[20px]">{name}</h5>
          <p className="font-normal text-sm text-[#737373]">
            {pangkasDeskripsi(deskripsi, 28) ||
              "Diperoleh dari kedelai pilihan"}
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
                className={`text-white font-medium p-2 transition-opacity duration-300 ease-in-out ${
                  isHover ? "opacity-100" : "opacity-0 overflow-hidden"
                }`}
              >
                Beli
              </p>
              <PlusIcon
                stroke={!isHover ? "#199F48" : "white"}
                onClick={() => onClickFocus(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
