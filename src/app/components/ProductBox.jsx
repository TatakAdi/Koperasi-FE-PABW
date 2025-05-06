import { PlusIcon } from "lucide-react";

export default function ProductBox({ name, price }) {
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
          <p className="font-normal text-sm text-[#737373]">1,2RB terjual</p>
          {/*Jumlah terjual */}
        </div>
        <div className="flex w-full  justify-between pb-4">
          <p className="font-medium text-base">
            Rp{" "}
            <span className="font-bold text-base">
              {price.toLocaleString("id-ID")}
            </span>
          </p>
          <PlusIcon />
        </div>
      </div>
    </div>
  );
}
