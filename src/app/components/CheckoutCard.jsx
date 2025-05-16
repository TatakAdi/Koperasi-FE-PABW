'use client';
import { useState } from 'react';

export default function CheckoutCard({ total, onCancel, onContinue }) {
  const [selectedType, setSelectedType] = useState('');

  const handleSelectChange = (event) => {
    setSelectedType(event.target.value);
  };

  return (
    <div
      className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4"
      style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
    >
      <div
        className="inline-flex flex-col items-start gap-[10px] p-4 w-full max-w-md"
        style={{
          borderRadius: '12px',
          background: '#FFF',
          fontFamily: 'Geist, sans-serif',
          boxShadow:
            '0px 16px 32px -3px rgba(0, 0, 0, 0.04), 0px 12px 24px -1.5px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px #E0E0E0, 0px 8px 16px -0.5px rgba(0, 0, 0, 0.02), -8px 0px 24px 16px rgba(0, 0, 0, 0.04)',
        }}
      >
        <h2 className="text-[#171717] text-[18px] font-medium leading-[20px] tracking-[-0.072px] w-full">
          Tipe Pemesanan
        </h2>

        <div className="relative w-full">
          <select
            value={selectedType}
            onChange={handleSelectChange}
            className="w-full rounded-md border border-[#D0D0D0] bg-[#FCFCFC] px-4 py-3 pr-12 focus:outline-none text-gray-900 appearance-none"
          >
            <option value="" disabled hidden>
              Pilih tipe pemesanan
            </option>
            <option value="Pesan antar">Pesan antar</option>
            <option value="COD">COD</option>
          </select>
          <img
            src="/Frame.svg"
            alt="Frame Logo"
            className="pointer-events-none absolute top-1/2 right-4 w-6 h-6 -translate-y-1/2"
          />
        </div>

        <div className="flex justify-between gap-3 w-full mt-4">
          <button
            onClick={onCancel}
            className="flex h-10 px-2 flex-1 justify-center items-center gap-1 rounded-lg bg-white shadow-[0px_4px_4px_-0.5px_rgba(0,0,0,0.04),0px_0px_0px_1px_#E0E0E0,0px_2px_4px_0px_rgba(0,0,0,0.04)] text-red-500 text-sm font-medium"
          >
            Batal
          </button>
          <button
            onClick={() => {
              if (!selectedType) {
                alert('Pilih tipe pemesanan terlebih dahulu');
                return;
              }
              onContinue(selectedType);
            }}
            className="flex h-10 px-2 flex-1 justify-center items-center gap-1 rounded-lg bg-black text-white text-sm font-medium"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}
