'use client';
import CheckoutCard from '@/components/keranjang/CheckoutCard';
import Header from '@/components/Navbar';
import SidePanel from '@/components/SidePanel';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function KeranjangPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const router = useRouter();
  const [kategori, setKategori] = useState('Makanan Berat');
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([
    { id: 1, name: 'Nasi Ayam Geprek', category: 'Makanan Berat', price: 25000, quantity: 1, image: '/AyamGeprek.svg' },
    { id: 2, name: 'Piscok Lumer asli Probolinggo Chef Nabil', category: 'Makanan Ringan', price: 17999999999, quantity: 1, image: '/PisCok.svg' },
    { id: 3, name: 'Es Teh', category: 'Minuman', price: 5000, quantity: 1, image: '/EsTeh.svg' },
    { id: 4, name: 'Keripik Singkong', category: 'Makanan Ringan', price: 10000, quantity: 1, image: '/KeripikSingkong.svg' },
    { id: 5, name: 'Mie Goreng Jawa', category: 'Makanan Berat', price: 30000, quantity: 1, image: '/MieJawa.svg' },
  ]);

  const filteredProducts = products.filter(
    (item) =>
      // item.category === kategori && // Ini buat kategorikan sesuai sidebar
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFiltered = products.filter((item) =>
    selectedItems.includes(item.id)
  );

  const total = selectedFiltered.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const hasSelectedItems = selectedItems.length > 0;

  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id]
    );
  };

  const handleQuantityChange = (id, delta) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleSelectAll = () => {
    const idsInView = filteredProducts.map((p) => p.id);
    const isAllSelected = idsInView.every((id) =>
      selectedItems.includes(id)
    );
    if (isAllSelected) {
      setSelectedItems((prev) =>
        prev.filter((id) => !idsInView.includes(id))
      );
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

  return (
    <div className="min-h-screen">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="flex">
        {/* <Sidebar onSelectCategory={setKategori} selectedCategory={kategori} /> */}
        <SidePanel/>
        <main className="flex-1 bg-white flex flex-col items-start">
          <section className="w-[1124px] min-h-[932px] px-5 py-4 bg-white rounded-xl inline-flex flex-col justify-start items-start gap-4 overflow-hidden mt-8">
            <div className="inline-flex justify-start items-start gap-4">
              <div className="text-base font-medium text-[#222] font-['Geist'] leading-tight">Keranjang Anda</div>
            </div>
            <div className="flex-1 flex flex-col justify-start items-start gap-12">
              <div className="flex flex-col justify-start items-start">
                {/* Header */}
                <div className="w-[1084px] h-14 relative border-b border-[#e5e7eb] overflow-hidden">
                  <div className="w-[1084px] max-w-[1084px] left-0 top-0 absolute inline-flex justify-start items-center">
                    <div className="w-[360px] h-14 min-w-80 border-r border-[#e5e7eb] flex justify-start items-center gap-[106px]">
                      <div className="w-6 h-6" />
                      <div className="text-base font-medium text-[#737373] font-['Geist'] leading-normal">Nama Barang</div>
                    </div>
                    <div className="flex-1 h-14 border-r border-[#e5e7eb] flex justify-center items-center">
                      <div className="text-base font-medium text-[#737373] font-['Geist'] leading-normal">Harga</div>
                    </div>
                    <div className="flex-1 h-14 border-r border-[#e5e7eb] flex justify-center items-center">
                      <div className="text-base font-medium text-[#737373] font-['Geist'] leading-normal">Jumlah</div>
                    </div>
                    <div className="w-[200px] h-14 border-r border-[#e5e7eb] flex justify-center items-center gap-4">
                      <div className="text-base font-medium text-[#737373] font-['Geist'] leading-normal">Aksi</div>
                    </div>
                  </div>
                </div>
                {/* Items */}
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`w-[1084px] h-[120px] relative border-b border-[#e5e7eb] flex items-center ${selectedItems.includes(product.id) ? 'bg-[#e6f7ec]' : ''}`}
                  >
                    <div className="w-[360px] min-w-80 min-h-[120px] py-7 border-r border-[#e5e7eb] flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product.id)}
                        onChange={() => handleSelect(product.id)}
                        className="w-6 h-6 accent-[#189e48] rounded-md border-2 border-[#189e48]"
                      />
                      <div className="flex items-center gap-4">
                        <img className="w-16 h-16 rounded-lg" src={product.image} alt={product.name} />
                        <div className="flex flex-col gap-1">
                          <div className="text-base font-medium text-neutral-900 font-['Geist'] leading-tight">{product.name}</div>
                          <div className="text-sm text-[#999] font-normal font-['Geist'] leading-tight">{product.category}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
                      <div className="text-base font-medium text-[#222] font-['Geist']">
                        Rp. {product.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div className="flex-1 h-full px-4 py-7 border-r border-[#e5e7eb] flex justify-center items-center gap-3">
                      <button
                        className="w-6 h-6 flex items-center justify-center rounded-l-sm bg-[#f2f4f7] text-[#189e48] border"
                        onClick={() => handleQuantityChange(product.id, -1)}
                        disabled={product.quantity <= 1}
                      >-</button>
                      <div className="w-8 text-center text-base text-neutral-900">{product.quantity}</div>
                      <button
                        className="w-6 h-6 flex items-center justify-center rounded-r-sm bg-[#f2f4f7] text-[#189e48] border"
                        onClick={() => handleQuantityChange(product.id, 1)}
                      >+</button>
                    </div>
                    <div className="w-[200px] h-full px-4 py-7 border-r border-[#e5e7eb] flex items-center justify-center">
                      <button
                        className="text-base font-medium text-[#e74c3c] font-['Geist']"
                        onClick={() => handleDelete(product.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Footer */}
              {hasSelectedItems && (
                <div className="w-[1084px] h-12 flex items-center">
                  <div className="w-[360px] min-w-80 h-12 border-r border-[#e5e7eb] flex items-center gap-[106px]">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={filteredProducts.every((p) => selectedItems.includes(p.id)) && filteredProducts.length > 0}
                      className="w-6 h-6 accent-[#189e48] rounded-md border-2 border-[#189e48]"
                    />
                    <div className="text-base font-medium text-[#222] font-['Geist']">
                      Pilih Semua ({filteredProducts.length})
                    </div>
                  </div>
                  <div className="w-[262px] h-12 px-4 border-r border-[#e5e7eb] flex items-center justify-center">
                    <button
                      className="text-base font-medium text-[#e74c3c] font-['Geist']"
                      onClick={handleClearSelection}
                    >
                      Hapus Seleksi
                    </button>
                  </div>
                  <div className="w-[262px] h-12 flex items-center justify-center">
                    <div>
                      <span className="text-base font-normal text-[#222] font-['Geist']">Total ({selectedFiltered.length} Produk):</span>
                      <br />
                      <span className="text-xl font-semibold text-[#222] font-['Geist']">Rp. {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="w-[200px] h-12 flex items-center justify-center">
                    <button
                      className="w-full h-10 bg-[#189e48] rounded-lg text-white font-medium font-['Geist']"
                      onClick={() => setShowCheckout(true)}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {showCheckout && (
        <CheckoutCard
          total={total}
          products={products}
          selectedItems={selectedItems}
          onCancel={() => setShowCheckout(false)}
          onContinue={(type) => {
            alert(`Pesanan dengan tipe: ${type} berhasil!`);
            setShowCheckout(false);
          }}
        />
      )}
    </div>
  );
}
