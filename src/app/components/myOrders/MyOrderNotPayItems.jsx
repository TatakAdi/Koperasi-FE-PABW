export default function MyOrderNotPayItems({
  id,
  image,
  name,
  category,
  price,
  quantity,
  onPayHandle,
}) {
  const finalPrice = price * quantity;

  return (
    <div
      key={id}
      className={`h-[120px] relative border-b border-[#e5e7eb] grid grid-cols-4 items-center`}
    >
      <div className="min-h-[120px] py-7 border-r border-[#e5e7eb]  items-center gap-4">
        {/**Kolom 1: Nama Produk dan gambar */}
        <div className="flex items-center gap-4 ">
          <img
            className="w-16 h-16 rounded-lg"
            src={image || "Piscok.svg"}
            alt={name}
          />
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium text-neutral-900 font-['Geist'] leading-tight">
              {name}
            </div>
            <div className="text-sm text-[#999] font-normal font-['Geist'] leading-tight">
              {category}
            </div>
          </div>
        </div>
      </div>
      {/**Kolom 2: Harga */}
      <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
        <div className="text-base font-medium text-[#222] font-['Geist']">
          Rp. {finalPrice.toLocaleString("id-ID")}
        </div>
      </div>
      {/**Kolom 3: Harga */}
      <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex justify-center items-center gap-3">
        <div className="w-8 text-center text-base text-neutral-900">
          {quantity}
        </div>
      </div>
      {/**Kolom 4: Tombol aksi bayar */}
      <div className=" h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
        <button
          className="text-base font-medium text-[#199F48] font-['Geist'] cursor-pointer hover:underline hover:underline-offset-2"
          onClick={() => onPayHandle(id)}
        >
          Bayar
        </button>
      </div>
    </div>
  );
}
