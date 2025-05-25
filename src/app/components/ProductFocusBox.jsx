import { MinusIcon, PlusIcon } from "lucide-react";

export default function ProductFocusBox({
  name,
  stock,
  onFocusChange,
  addCartItem,
  order,
  productDataLoad,
  onChangeorder,
  onPlusOrder,
  onMinOrder,
  onResetValue,
  addCartItemLoad,
  isSucced,
  succedMessage,
}) {
  return (
    <div
      className={`fixed inset-0 ${
        isSucced ? "bg-none" : "bg-[rgba(255,255,255,0.3)]"
      } w-full h-screen flex justify-center items-center z-0`}
    >
      {!isSucced && (
        <div className="bg-white w-[408px] h-[226px] rounded-3xl p-4 grid gap-1.5">
          <div className="w-full flex flex-row gap-3.5">
            <img
              src="image.png"
              alt="Pratinjau Produk"
              className="w-[184px] h-[138px] rounded-lg"
            />
            <div className="w-[180px] flex flex-col justify-between">
              {productDataLoad === false ? (
                <div>
                  <h3 className="font-medium text-base text-[#171717]">
                    {name}
                  </h3>
                  <p className="font-normal text-sm text-[#969696]">
                    Stok: {stock}
                  </p>
                </div>
              ) : (
                <div className="flex h-full w-full justify-center items-center ">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-[#199F48]"></div>
                </div>
              )}
              <div className="w-full flex justify-around">
                <MinusIcon
                  stroke="green"
                  className="hover:bg-green-500 hover:text-white cursor-pointer rounded-full"
                  onClick={onMinOrder}
                />
                <input
                  type="number"
                  value={order}
                  onChange={onChangeorder}
                  min="1"
                  max={stock}
                  className="bg-[#F2F4F7] w-[108px] text-center"
                />
                <PlusIcon
                  stroke="green"
                  className="hover:bg-green-500 hover:text-white cursor-pointer rounded-full"
                  onClick={onPlusOrder}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-between items-center gap-5 ">
            <button
              className="text-[#ef4444] bg-[#fff] rounded-lg w-[182px] py-2 cursor-pointer shadow-[0px_0px_6px_rgba(224,224,224,1)]"
              onClick={() => {
                onFocusChange(false);
                onResetValue();
              }}
            >
              Batal
            </button>
            <button
              className="flex justify-center items-center text-[#fff] bg-[#199F48] rounded-lg w-[182px] py-2 cursor-pointer"
              onClick={() => addCartItem()}
            >
              {!addCartItemLoad ? (
                "Tambahkan"
              ) : (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
              )}
            </button>
          </div>
        </div>
      )}
      {isSucced && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-xl shadow-md text-sm flex items-center gap-2 z-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {succedMessage}
        </div>
      )}
    </div>
  );
}
