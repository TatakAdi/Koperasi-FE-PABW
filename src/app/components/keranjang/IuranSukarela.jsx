'use client';

export default function IuranSukarela({
  saldo = 1000000,
  items = [],
  total = 0,
  onConfirm,
  onCancel
}) {
  return (
    <div
      className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4"
      style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-base font-semibold">Konfirmasi Pembelian</h2>

        <div className="flex justify-between text-sm text-gray-800">
          <span>Saldo Iuran Sukarela</span>
          <span className="font-medium">Rp. {saldo.toLocaleString('id-ID')}</span>
        </div>

        <hr className="my-2 border-gray-300" />

        {items.map((item, index) => (
          <div key={index} className="space-y-1 text-sm">
            <p className="text-gray-800">{item.name}</p>
            <div className="flex justify-between">
              <span>{item.quantity}x</span>
              <span className="font-medium">Rp. {item.price.toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}

        <hr className="my-2 border-gray-300" />

        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span className="text-base font-bold">Rp. {total.toLocaleString('id-ID')}</span>
        </div>

        <div className="flex justify-between gap-3 w-full pt-2">
          <button
            onClick={onCancel}
            className="flex h-10 px-4 flex-1 justify-center items-center gap-1 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
          >
            Kembali
          </button>
          <button
            onClick={onConfirm}
            className="flex h-10 px-4 flex-1 justify-center items-center gap-1 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}
