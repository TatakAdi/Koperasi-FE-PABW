export default function OrderDoneItem({
  id,
  name,
  category,
  subtotal,
  status,
  image,
  jumlah, // Add jumlah prop here
}) {
  const statusIcons = {
    "diterima pembeli": "Pesanan-Selesai-Status.svg",
    "dibatalkan": "Dibatalkan-Status.svg",
  };

  const deliveryStatus = statusIcons[status] || "";

  return (
    <div
      key={id}
      className={`h-[120px] relative border-b border-[#e5e7eb] grid grid-cols-5 items-center`} // Changed to grid-cols-5
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
              {category.name}
            </div>
          </div>
        </div>
      </div>
      {/**Kolom 2: Harga */}
      <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
        <div className="text-base font-medium text-[#222] font-['Geist']">
          Rp. {subtotal.toLocaleString("id-ID")}
        </div>
      </div>
      {/**Kolom 3: Jumlah */}
      <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex justify-center items-center gap-3">
        <div className="w-8 text-center text-base text-neutral-900">
          {jumlah || 0} {/* Add fallback value */}
        </div>
      </div>
      {/**Kolom 4: Status barang */}
      <div className="h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
        <img
          src="/Pesanan-Selesai-Status.svg"
          alt={`Status: ${status}`}
          onError={(e) => {
            e.target.onerror = null;
            console.log(`Failed to load status icon for status: ${status}`);
          }}
        />
      </div>
      {/**Kolom 5: Opsi beli lagi */}
      <div className="h-full px-4 py-7 flex items-center justify-center">
        <img
          src="/Cart-Add.svg" // Add leading slash
          alt="Beli Lagi"
          className="cursor-pointer hover:opacity-80 transition-opacity"
        />
      </div>
    </div>
  );
}
