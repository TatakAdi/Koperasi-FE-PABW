'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import CartItem from '@/components/CartItem';
import Header from '@/components/HeaderKeranjang';

export default function KeranjangPage() {
  const [kategori, setKategori] = useState('Makanan Berat');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([
    { id: 1, name: 'Nasi Ayam Geprek', category: 'Makanan Berat', price: 25000, quantity: 1, image: '/AyamGeprek.svg' },
    { id: 2, name: 'Piscok Lumer asli Probolinggo Chef Nabil', category: 'Makanan Ringan', price: 17999999999, quantity: 1, image: '/PisCok.svg' },
    { id: 3, name: 'Es Teh', category: 'Minuman', price: 5000, quantity: 1, image: '/EsTeh.svg' },
    { id: 4, name: 'Keripik Singkong', category: 'Makanan Ringan', price: 10000, quantity: 1, image: '/KeripikSingkong.svg'},
    { id: 5, name: 'Mie Goreng Jawa', category: 'Makanan Berat', price: 30000, quantity: 1, image: '/MieJawa.svg'},
  ]);

  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleQuantityChange = (id, delta) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const handleSelectAll = () => {
    const idsInView = filteredProducts.map((p) => p.id);
    const isAllSelected = idsInView.every((id) => selectedItems.includes(id));
    if (isAllSelected) {
      setSelectedItems((prev) => prev.filter((id) => !idsInView.includes(id)));
    } else {
      setSelectedItems((prev) => [...new Set([...prev, ...idsInView])]);
    }
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleDelete = (id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: 1 } : item
      )
    );
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const filteredProducts = products.filter(
    (item) => item.category === kategori && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedFiltered = products.filter((item) => selectedItems.includes(item.id));
  const total = selectedFiltered.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex">
        <Sidebar onSelectCategory={setKategori} selectedCategory={kategori} />
        <main className="flex-1 bg-white">
          <section className="p-6">
            <h2 className="text-xl font-semibold mb-4">Keranjang Anda - {kategori}</h2>
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <CartItem
                  key={product.id}
                  product={product}
                  isSelected={selectedItems.includes(product.id)}
                  onSelect={handleSelect}
                  onQuantityChange={handleQuantityChange}
                  onDelete={() => handleDelete(product.id)}
                />
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 border-t pt-4 px-4">
              <div className="flex items-center gap-4">
                <label>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredProducts.every((p) => selectedItems.includes(p.id)) && filteredProducts.length > 0}
                  />
                  <span className="ml-2">Pilih Semua ({filteredProducts.length})</span>
                </label>
                <button className="text-red-500" onClick={handleClearSelection}>Hapus Seleksi</button>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p>Total ({selectedFiltered.length} Produk):</p>
                  <p className="font-bold text-lg">Rp. {total.toLocaleString('id-ID')}</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
                  Checkout
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}