const CartItem = ({ product, isSelected, onSelect, onQuantityChange, onDelete }) => {
  return (
    <div
      className={`grid grid-cols-[40px_1fr_170px_150px_100px] items-center gap-2 px-4 py-4 text-lg transition-colors ${
        isSelected ? 'bg-green-50' : 'bg-white'
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(product.id)}
        className="mx-auto w-4 h-4"
      />
      <div className="flex items-center gap-3">
        <img
          src={product.image_url}
          alt={product.name}
          width={48}
          height={48}
          className="rounded-md object-cover"
        />
        <div>
          <div className="font-medium">{product.name}</div>
          <div className="text-gray-500 text-xs">{product.category}</div>
        </div>
      </div>
      <div className="text-left text-lg text-gray-800">
        <span className="text-lg align-top">Rp.</span>{' '}
        <span className="font-semibold">{product.price.toLocaleString('id-ID')}</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => onQuantityChange(product.id, -1)}
          className="w-6 h-6 rounded text-green-600 text-base flex items-center justify-center"
        >
          −
        </button>
        <input
          type="text"
          value={product.quantity}
          readOnly
          className="w-10 text-center text-sm border rounded bg-gray-50"
        />
        <button
          onClick={() => onQuantityChange(product.id, 1)}
          className="w-6 h-6 rounded text-green-600 text-base flex items-center justify-center"
        >
          +
        </button>
      </div>
      <button
        className="text-red-500 text-lg mx-auto"
        onClick={() => onDelete(product.id)}
      >
        Hapus
      </button>
    </div>
  );
};

export default CartItem;