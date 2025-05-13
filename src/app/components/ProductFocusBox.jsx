import { MinusIcon, PilcrowSquare, PlusIcon } from "lucide-react";

export default function ProductFocusBox({
  name,
  stok,
  onFocusChange,
  addCart,
  order,
  onChangeorder,
}) {
  return (
    <div className="fixed inset-0 bg-[rgba(255,255,255,0.3)] w-full h-screen flex justify-center items-center z-0">
      <div className="bg-white w-[408px] h-[226px] rounded-3xl p-4 grid gap-1.5">
        <div className="w-full flex flex-row gap-3.5">
          <img
            src="image.png"
            alt="Pratinjau Produk"
            className="w-[184px] h-[138px] rounded-lg"
          />
          <div className="w-[180px] flex flex-col justify-between">
            <div>
              <h3 className="font-medium text-base text-[#171717]">
                Lato-lato kehidupan
              </h3>
              <p className="font-normal text-sm text-[#969696]">Stok: 3</p>
            </div>
            <div className="w-full flex justify-around">
              <MinusIcon
                stroke="green"
                className="hover:bg-green-500 hover:text-white cursor-pointer rounded-full"
              />
              <input
                type="number"
                value={order}
                onChange={onChangeorder}
                min="1"
                max={stok}
                className="bg-[#F2F4F7] w-[108px] text-center"
              />
              <PlusIcon
                stroke="green"
                className="hover:bg-green-500 hover:text-white cursor-pointer rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="w-full flex justify-between items-center gap-5 ">
          <button
            className="text-[#ef4444] bg-[#fff] rounded-lg w-[182px] py-2 cursor-pointer shadow-[0px_0px_6px_rgba(224,224,224,1)]"
            onClick={() => onFocusChange(false)}
          >
            Batal
          </button>
          <button
            className="text-[#fff] bg-[#199F48] rounded-lg w-[182px] py-2 cursor-pointer"
            onClick={addCart}
          >
            Tambahkan
          </button>
        </div>
      </div>
    </div>
  );
}
