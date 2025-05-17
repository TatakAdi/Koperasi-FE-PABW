'use client';
import { useState } from 'react';

export default function PaymentMethodStep({ onContinue, onCancel }) {
  const [method, setMethod] = useState('');
  const [methodError, setMethodError] = useState(false);

  const handleContinue = () => {
    if (!method) {
      setMethodError(true);
      return;
    }
    setMethodError(false);
    onContinue(method);
  };

  return (
    <div className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4" style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}>
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
        <h2 className="text-lg font-semibold">Metode Pembayaran</h2>
        <div className="relative w-full">
          <select
            value={method}
            onChange={(e) => {setMethod(e.target.value); setMethodError(false);}}
            className={`w-full rounded-md border border-[#D0D0D0] px-4 py-3 pr-12 focus:outline-none text-gray-900 appearance-none transition-colors ${
            method ? 'bg-blue-50' : 'bg-[#FCFCFC]'
            } ${methodError ? 'border-red-500' : ''}`}
          >
            <option value="" disabled hidden>Pilih tipe pembayaran</option>
            <option value="Transfer">Transfer</option>
            <option value="COD">COD</option>
          </select>
          <img
            src="/Frame.svg"
            alt="Frame Logo"
            className="pointer-events-none absolute top-1/2 right-4 w-6 h-6 -translate-y-1/2"
          />
            {methodError && (
                <span className="text-xs text-red-500 mt-1 absolute left-0 -bottom-5">Tolong Pilih Metode Pembayaran</span>
            )}
        </div>
        <div className="flex justify-between gap-3 w-full mt-4">
          <button onClick={onCancel} className="flex h-10 px-2 flex-1 justify-center items-center gap-1 rounded-lg bg-white shadow-[0px_4px_4px_-0.5px_rgba(0,0,0,0.04),0px_0px_0px_1px_#E0E0E0,0px_2px_4px_0px_rgba(0,0,0,0.04)] text-red-500 text-sm font-medium hover:bg-red-50 transition">Kembali</button>
          <button onClick={handleContinue} className="flex h-10 px-2 flex-1 justify-center items-center gap-1 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition">Lanjutkan</button>
        </div>
      </div>
    </div>
  );
}