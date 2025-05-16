import Image from 'next/image';

const CartItem = ({ product, isSelected, onSelect, onQuantityChange, onDelete }) => {
  return (
    <div className={`flex items-center justify-between py-4 border-b px-4 ${isSelected ? 'bg-green-50' : ''}`}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => onSelect(product.id)}
        className="mr-4"
      />
      <div className="flex items-center gap-4 flex-1">
        <Image src={product.image} alt={product.name} width={60} height={60} className="rounded" />
        <div>
          <div className="font-semibold">{product.name}</div>
          <div className="text-sm text-gray-500">{product.category}</div>
        </div>
      </div>
      <div className="w-40 text-right font-bold">Rp. {product.price.toLocaleString('id-ID')}</div>
      <div className="flex items-center w-32 justify-center gap-2">
        <button onClick={() => onQuantityChange(product.id, -1)} className="text-2xl text-gray-500">−</button>
        <input
          type="text"
          value={product.quantity}
          readOnly
          className="w-10 text-center border rounded"
        />
        <button onClick={() => onQuantityChange(product.id, 1)} className="text-2xl text-green-500">+</button>
      </div>
      <button onClick={onDelete} className="text-red-500 ml-4">Hapus</button>
    </div>
  );
};

export default CartItem;
