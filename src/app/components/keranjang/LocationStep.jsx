'use client';
import { useState, useEffect } from 'react';

const lokasiData = {
  'Pesan antar': {
    gedung: ['Gedung A', 'Gedung B', 'Gedung C', 'Gedung D', 'Gedung E', 'Gedung F', 'Gedung G']
  },
  'Ambil di tempat': {
    detail: 'Selasar Gedung A, di depan perpustakaan',
    gedung: []
  }
};

export default function LocationStep({ orderType, onContinue, onCancel }) {
  const [selectedGedung, setSelectedGedung] = useState('');
  const [catatan, setCatatan] = useState('');
  const [catatanError, setCatatanError] = useState(false);
  const [gedungError, setGedungError] = useState(false);

  const data = lokasiData[orderType];

  useEffect(() => {
    if (data.gedung.length > 0) {
      setSelectedGedung('');
    }
  }, [orderType]);

  const handleContinue = () => {
    if (data.gedung.length > 0 && selectedGedung === '') {
        setGedungError(true);
        return;
    }
    if (orderType === 'Pesan antar' && catatan.trim() === '') {
        setCatatanError(true);
        return;
    }
    setGedungError(false);
    setCatatanError(false);
    onContinue({
        detail: data.detail,
        gedung: selectedGedung,
        catatan: catatan.trim()
    });
  };
  function cn(...args) {
    return args.filter(Boolean).join(' ');
  }

  return (
    <div className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4" style={{ backdropFilter: 'blur(2px)' }}>
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl px-6 py-7 space-y-4 flex flex-col"
        style={{
          fontFamily: 'Geist, sans-serif',
          boxShadow:
            '0px 16px 32px -3px rgba(0, 0, 0, 0.04), 0px 12px 24px -1.5px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px #E0E0E0, 0px 8px 16px -0.5px rgba(0, 0, 0, 0.02), -8px 0px 24px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h2 className="text-lg font-semibold mb-1">
          {orderType === 'Ambil di tempat' ? 'Alamat Koperasi' : 'Alamat Pengiriman'}
        </h2>

        <div className="flex flex-col space-y-4 w-full">
          {orderType !== 'Pesan antar' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold mb-1">Detail Lokasi</label>
              <p className="text-sm text-gray-800 rounded-md border border-[#D0D0D0] bg-blue-50 bg-[#FCFCFC] px-4 py-3 pr-12">{data.detail}</p>
            </div>
          )}

          {data.gedung.length > 0 && (
            <div className="flex flex-col gap-1 relative w-full">
                <label className="text-sm font-semibold mb-1">Gedung</label>
                <select
                value={selectedGedung}
                onChange={(e) => {
                    setSelectedGedung(e.target.value);
                    setGedungError(false);
                }}
                className={cn(
                    "w-full rounded-md border border-[#D0D0D0] px-4 py-3 pr-12 focus:outline-none text-gray-900 appearance-none transition-colors",
                    selectedGedung !== '' ? "bg-blue-50" : "bg-[#FCFCFC]",
                    gedungError && "border-red-500"
                )}
                style={{
                    WebkitAppearance: 'none',
                }}
                >
                <option value="" disabled hidden>
                    Pilih gedung
                </option>
                {data.gedung.map((gedung, index) => (
                    <option key={index} value={gedung}>{gedung}</option>
                ))}
                </select>
                <img
                src="/Frame.svg"
                alt="Frame Logo"
                className="pointer-events-none absolute top-1/2 right-4 w-6 h-6"
                />
                {gedungError && (
                <span className="text-xs text-red-500 mt-1">Tolong Masukkan Pilihan Gedung</span>
                )}
            </div>
          )}

          {orderType === 'Pesan antar' && (
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold mb-1">Catatan Lokasi</label>
                <textarea
                value={catatan}
                onChange={(e) => {
                    setCatatan(e.target.value);
                    setCatatanError(false);
                }}
                rows={2}
                placeholder="Contoh: Antarkan ke gedung F kelas F201"
                className={cn(
                    "w-full rounded-md border border-[#D0D0D0] px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-black transition-colors",
                    catatan.trim() ? "bg-blue-50" : "bg-[#FCFCFC]",
                    catatanError && "border-red-500"
                )}
                />
                {catatanError && (
                <span className="text-xs text-red-500 mt-1">Tolong Masukkan Lokasi Pengantaran</span>
                )}
            </div>
            )}
        </div>

        <div className="flex justify-between gap-3 w-full pt-3">
          <button
            onClick={onCancel}
            className="flex h-10 px-2 flex-1 justify-center items-center gap-1 rounded-lg bg-white shadow-[0px_4px_4px_-0.5px_rgba(0,0,0,0.04),0px_0px_0px_1px_#E0E0E0,0px_2px_4px_0px_rgba(0,0,0,0.04)] text-red-500 text-sm font-medium hover:bg-red-50 transition"
          >
            Kembali
          </button>
          <button
            onClick={handleContinue}
            className="flex h-10 px-2 flex-1 justify-center items-center gap-1 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}