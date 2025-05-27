export default function MyOrderNotPayItems({
  id,
  image,
  name,
  price,
  quantity,
}) {
  return (
    <div
      key={product.id}
      className={`w-[1084px] h-[120px] relative border-b border-[#e5e7eb] flex items-center ${
        selectedItems.includes(product.id) ? "bg-[#e6f7ec]" : ""
      }`}
    >
      <div className="w-[360px] min-w-80 min-h-[120px] py-7 border-r border-[#e5e7eb] flex items-center gap-4">
        <img
          src={
            selectedItems.includes(product.id)
              ? "/checked_box.svg"
              : "/unchecked_box.svg"
          }
          alt={selectedItems.includes(product.id) ? "Checked" : "Unchecked"}
          className="w-6 h-6 cursor-pointer"
          onClick={() => handleSelect(product.id)}
        />
        <div className="flex items-center gap-4">
          <img
            className="w-16 h-16 rounded-lg"
            src={product.image}
            alt={product.name}
          />
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium text-neutral-900 font-['Geist'] leading-tight">
              {product.name}
            </div>
            <div className="text-sm text-[#999] font-normal font-['Geist'] leading-tight">
              {product.category}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
        <div className="text-base font-medium text-[#222] font-['Geist']">
          Rp. {product.price.toLocaleString("id-ID")}
        </div>
      </div>
      <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex justify-center items-center gap-3">
        <img
          src="/minus.svg"
          alt="Kurangi"
          className={`w-6 h-6 cursor-pointer ${
            product.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() =>
            product.quantity > 1 && handleQuantityChange(product.id, -1)
          }
          style={{
            pointerEvents: product.quantity <= 1 ? "none" : "auto",
          }}
        />
        <div className="w-8 text-center text-base text-neutral-900">
          {product.quantity}
        </div>
        <img
          src="/plus.svg"
          alt="Tambah"
          className={`w-6 h-6 cursor-pointer ${
            product.quantity >= (product.stock ?? product.stok ?? 99)
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={() =>
            product.quantity < (product.stock ?? product.stok ?? 99) &&
            handleQuantityChange(product.id, 1)
          }
        />
      </div>
      <div className="w-[200px] h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
        <button
          className="text-base font-medium text-[#e74c3c] font-['Geist'] cursor-pointer"
          onClick={() => handleDelete(product.id)}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
