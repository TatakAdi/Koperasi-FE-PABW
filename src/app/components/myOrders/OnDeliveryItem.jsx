export default function OnDeliveryItem({
  id,
  image,
  name,
  subtotal,
  category,
  status,
  jumlah,
  onUpdateStatus, // Add this prop
}) {
  const statusIcons = {
    "akan dikirim": "/Sedang-Dikirim-Status.svg",
    "sudah dibooking": "/Siap-Diambil-Status.svg",
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "/Piscok.svg";
  };

  const productImage = image?.startsWith("local:")
    ? image.replace("local:", "/")
    : image;

  return (
    <div
      key={id}
      className={`h-[120px] relative border-b border-[#e5e7eb] grid grid-cols-5 items-center`} // Changed to grid-cols-5
    >
      <div className="min-h-[120px] py-7 border-r border-[#e5e7eb]  items-center gap-4">
        {/**Kolom 1: Nama Produk dan gambar */}
        <div className="flex items-center gap-4 ">
          <img
            className="w-16 h-16 rounded-lg object-cover"
            src={productImage || "/Piscok.svg"}
            alt={name}
            onError={handleImageError}
          />
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium text-neutral-900 font-['Geist'] leading-tight">
              {name}
            </div>
            <div className="text-sm text-[#999] font-normal font-['Geist'] leading-tight">
              {category?.name || "Uncategorized"}
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
      {/**Kolom 3: Harga */}
      <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex justify-center items-center gap-3">
        <div className="w-8 text-center text-base text-neutral-900">
          {jumlah}
        </div>
      </div>
      {/**Kolom 4: Status barang */}
      <div className="h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
        <img
          src={statusIcons[status] || "/Sedang-Dikirim-Status.svg"}
          alt={`Status: ${status}`}
          onError={(e) => {
            e.target.onerror = null;
            console.log(`Failed to load status icon for status: ${status}`);
          }}
        />
      </div>

      {/**Kolom 5: Action Button */}
      <div className="h-full px-4 py-7 flex items-center justify-center">
        <button
          onClick={() => onUpdateStatus(id)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          Terima Barang
        </button>
      </div>
    </div>
  );
}
