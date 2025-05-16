'use client';
import { useEffect, useState } from 'react';

export default function ConfirmationStep({ total, onConfirm, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 1 jam

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div
      className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4"
      style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Selesaikan Pembayaran</h2>

        <div className="flex justify-between text-base">
          <span>Total</span>
          <span className="font-bold text-lg">Rp. {total.toLocaleString('id-ID')}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Waktu tersisa:</span>
          <span className="text-red-500 font-semibold">{formatTime(timeLeft)}</span>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <p className="font-medium">Pilih metode pembayaran:</p>

          <div>
            <p className="text-xs text-gray-500 mb-1">QRIS</p>
            <img src="/qris.png" alt="QRIS" className="h-8" />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">GOPAY</p>
            <img src="/gopay.png" alt="GOPAY" className="h-8" />
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">VA Bank</p>
            <div className="flex gap-3 items-center">
              <img src="/bni.png" alt="BNI" className="h-5" />
              <img src="/mandiri.png" alt="Mandiri" className="h-5" />
              <img src="/bri.png" alt="BRI" className="h-5" />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Bank Transfer</p>
            <div className="flex gap-3 items-center">
              <img src="/bni.png" alt="BNI" className="h-5" />
              <img src="/mandiri.png" alt="Mandiri" className="h-5" />
              <img src="/bri.png" alt="BRI" className="h-5" />
              <img src="/bca.png" alt="BCA" className="h-5" />
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-2">Segera selesaikan pembayaran sebelum waktu habis.</p>

        <div className="flex justify-between gap-3 w-full mt-4">
          <button
            onClick={onCancel}
            className="flex h-10 px-4 flex-1 justify-center items-center gap-1 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-100 transition"
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
